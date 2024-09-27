<script setup lang="ts">
  import { CommonEditor } from '@ruomu-ui/editor'
  import { computed } from 'vue'
  import { toKebabCase, useComponentsStore, useProjectStore } from '@ruomu-ui/core'
  import { storeToRefs } from 'pinia'
  import type { JsMethod, MaterialLib, Property, Schema, Variable } from '@ruomu-ui/types'
  
  const projectStore = useProjectStore()
  const componentsStore = useComponentsStore()
  const { currentPageSchema } = storeToRefs(projectStore)
  
  type importInfo = {
    libName: string;
    componentName: string;
  }
  
  type CodeInfo = {
    code: string;
    imports: importInfo[];
  }

  const buildVariableCode = (v: Variable, spaceNum=2) => {
    const space = " ".repeat(spaceNum)
    let code = space + " ".repeat(2) + v.name + ":"
    if (v.type === "object") {
      code += "{\n"
      if (v.props) {
        for (const p of v.props) {
          code += buildVariableCode(p, spaceNum + 2) + ",\n"
        }
      }
      code += space + " ".repeat(2) + "}"
    } else if (v.type === "array") {
      code += "[]"
    } else if (v.type === "number") {
      if (v.defaultValue) {
        code += v.defaultValue 
      } else {
        code += "0"
      }
    } else if (v.type === "boolean") {
      if (v.defaultValue) {
        code += v.defaultValue 
      } else {
        code += "false"
      }
    } else {
      if (v.defaultValue) {
        code += "\"" + v.defaultValue + "\""
      } else {
        code += "null"
      } 
    }
    return code
  }
  
  const buildScriptInfo = ():CodeInfo => {
    let storeCode = "const store = useStore()\n"
    
    let stateCode = "const state = reactive({\n"
    for (const v of currentPageSchema.value.state) {
      stateCode += buildVariableCode(v) + ",\n"
    }
    stateCode += "})\n"
    
    let jsMethodsCode = ""
    const js = currentPageSchema.value.js
    // TODO 生命周期函数
    
    for (const method of js.methods) {
      jsMethodsCode += "\n// " + method.id + " -" + method.description + "\n const " + method.name + " = (" + method.params.join(", ") + ") => {\n" + method.code + "\n}\n"  
    }
    
    return { 
      code: [storeCode, stateCode, jsMethodsCode].join("\n"), 
      imports: [
        { libName: "vue", componentName: "reactive" },
        { libName: "@/store", componentName: "useStore" },
        { libName: "@/api", componentName: "api" }
      ] 
    }
  }
  
  const buildComponentStyleCode = (style: Record<string,  string>) => {
    let styleStaticCode = ""
    for (const s in style) {
      styleStaticCode += toKebabCase(s) + ':' + style[s] + ';'
    }
    
    return [{
      name: "style",
      value: styleStaticCode
    }]
  }
  
  const findMethodById = (id: string):(JsMethod|null) => {
    const js = currentPageSchema.value.js
    for (const method of js.methods) {
      if (method.id === id) {
        return method
      }
    }
    return null
  }
  
  const buildComponentCode = (c: Schema, spaceNum = 2): CodeInfo => {
    const space = " ".repeat(spaceNum)
    const imports = []
    let code = ""
    const component = componentsStore.findComponentById(c.componentId)
    if (component && (component.libVersionId || component.libId)) {
      let lib:(MaterialLib|undefined) = undefined
      if(component.libVersionId) {
        //@ts-ignore
        lib = componentsStore.getLibByActiveLibId(component.libVersionId)
      } else {
        //@ts-ignore
        const libs = componentsStore.libs.filter(l => l.id === component.libId)
        if (libs.length > 0) {
          lib = libs[0]
        }
      }
      if (lib) {
        if (lib.id!=='builtIn') {
          imports.push({ libName: lib.packageName, componentName: component.tagName })
        }
        code += space + "<" + c.tagName
        
        // 整合一下props和relatedProps
        const props:{name:string, value:any, sync?:boolean}[] = []
        if(c.relatedProps) {
          for (const p in c.relatedProps) {
            props.push({name:":"+p, value: c.relatedProps[p].varName, sync: c.relatedProps[p].syncUpdate})
          }
        }
        let innerHtml = ""
        if(c.props) {
          for (const p in c.props) {
            if (p === 'style') {
              props.push(...buildComponentStyleCode(c.props[p]))
              continue
            }
            if (p === 'innerHTML') {
              innerHtml = c.props[p]
              continue
            }
            // 检查props中是否已存在, 避免重复
            if (props.find(p => p.name === ":"+p)) {
              continue
            }
            let v = c.props[p]
            let n = p
            let componentProp:Property|undefined = undefined
            for (const g in component.metaInfo.props) {
              componentProp = component.metaInfo.props[g].properties.find(cp => cp.name === p)
              if (componentProp) {
                break
              }
            } 
            if (componentProp) {
              switch (componentProp.type) {
                case 'boolean':
                case 'number':
                  n = ":" + p
                  v = v.toString()
                  break
                case 'object':
                case 'array':
                  n = ":" + p
                  v = JSON.stringify(v)
                  break
                }
            }
            
            props.push({name: n, value: v })
          }
        }
        if(c.events) {
          for (const e of c.events) {
            const method = findMethodById(e.methodId)
            if (method) {
              props.push({
                name: e.eventName,
                value: method.name,
              })
            }
          }
        }
        
        for (const p of props) {
          let value = p.value
          if (p.sync) {
            code += " v-model" + p.name + '="' + value + '"'
          } else {
            code += ' ' + p.name + '="' + value + '"'
          }
        }
        code += ">"
        code += "\n"

        if (c.children && c.children.length > 0) {
          for (const child of c.children) {
            const ccInfo = buildComponentCode(child, spaceNum + 2)
            code += ccInfo.code + "\n"
            imports.push(...ccInfo.imports)
          }
        } else {
          code += space + " ".repeat(2) + innerHtml + "\n"
        }
        
        if (c.slots && c.slots.length > 0) {
          code += "\n"
          for (const slot of c.slots) {
            if (!slot.children) {
              continue
            }
            
            code += space + " ".repeat(2) + "<template #" + slot.name + ">\n"
            for (const child of slot.children) {
              if (typeof child === "string") {
                code += space + " ".repeat(4) + child + "\n"
              } else {
                const ccInfo = buildComponentCode(child, spaceNum + 4)
                code += ccInfo.code + '\n'
                imports.push(...ccInfo.imports)
              }
            }
            code += space + " ".repeat(2) +"</template>\n"
          }
        }
        code += space + "</" + c.tagName + ">"
      }
    }
    
    return { code, imports }
  }
  
  const buildTemplateInfo = ():CodeInfo => {
    let code = ""
    const imports = []
    const components = currentPageSchema.value.children
    for (const c of components) {
      const ci = buildComponentCode(c)
      code += ci.code + "\n"
      imports.push(...ci.imports)
    }
    return { code, imports }
  }
  const buildStyleContent = () => {
    return ""
  }
  
  type CombinedImportInfo = {
    libName: string;
    componentNames: string[];
  }
  const combineImportCode = (imports: importInfo[]):string => {
    const combinedImports: CombinedImportInfo[] = []
    for (const i of imports) {
      const found = combinedImports.find(ci => ci.libName === i.libName)
      if (found) {
        const components = found.componentNames
        if (components.includes(i.componentName)) {
          continue
        }
        found.componentNames.push(i.componentName)
      } else {
        combinedImports.push({ libName: i.libName, componentNames: [i.componentName] })
      }
    }
    return combinedImports.map(ci => {
      return "import { " + ci.componentNames.join(", ") + " } from '" + ci.libName + "'"
    }).join("\n")
  }
  
  const code = computed(() => {
    const scriptInfo = buildScriptInfo()
    const templateInfo = buildTemplateInfo()
    const imports = []
    imports.push(...scriptInfo.imports, ...templateInfo.imports)
    
    let script = "<" + "script setup>\n" + combineImportCode(imports) + "\n\n" + scriptInfo.code + "\n</" + "script" + ">"
    let style = "<" + "style scoped>\n" + buildStyleContent() + "\n</style>"
    let template = "<template>\n"+ templateInfo.code + "\n</template>"
    return [script, template, style].join("\n")
  })

  
</script>

<template>
  <div class="code-container">
    <common-editor :code="code" />
  </div>
</template>

<style scoped>
.code-container {
  height: calc(100vh - 100px);
  width: 720px;
}
</style>