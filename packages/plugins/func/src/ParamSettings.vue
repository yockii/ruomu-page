<script setup lang="ts">
import { NModal, NButton, NButtonGroup, NIcon, NTooltip, NInput, NDataTable, NSelect } from 'naive-ui'
import { computed, PropType, ref, h, onMounted } from 'vue'
import type { Parameter } from '@ruomu-ui/types'
import { ChevronDown, ChevronUp, Plus, Trash } from '@vicons/tabler'
import type { DataTableColumns } from 'naive-ui'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  params: {
    type: Array as PropType<Parameter[]>,
    required: true
  }
})
const emit = defineEmits(['update:visible', 'update:params'])
const visible = computed({
  get: () => props.visible,
  set: (v) => emit('update:visible', v)
})

const data = ref<Parameter[]>([])

const nameAllowed = (value: string) => {
  // js方法名只能包含字母、数字、下划线
  return /^[a-zA-Z_]\w*$/.test(value)
}
const columns : DataTableColumns<Parameter> = [
  {
    title: '参数名',
    key: 'name',
    render: (row, index) => {
      return h(NInput, {
        value: row.name,
        onUpdateValue: (v) => {
          data.value[index].name = v
        },
        allowInput: nameAllowed,
      })  
    }
  }, 
  {
    title: '描述',
    key: 'description',
    render: (row, index) => {
      return h(NInput, {
        value: row.description,
        onUpdateValue: (v) => {
          data.value[index].description = v
        }
      })
    }
  }, 
  {
    title: '类型',
    key: 'type',
    render: (row, index) => {
      return h(NSelect, {
        value: row.type,
        onUpdateValue: (v) => {
          data.value[index].type = v
        },
        options: [
          {
            label: 'string',
            value: 'string'
          }, {
            label: 'number',
            value: 'number'
          }, {
            label: 'boolean',
            value: 'boolean'
          }, {
            label: 'object',
            value: 'object'
          }, {
            label: 'array',
            value: 'array'
         }
        ]
      })
    }
  }, 
  {
    title: '默认值',
    key: 'defaultValue',
    render: (row, index) => {
      return h(NInput, {
        value: row.defaultValue,
        onUpdateValue: (v) => {
          data.value[index].defaultValue = v
        }
      })
    }
  }, 
  {
    title: '操作',
    key: 'action',
    render: (_, index) => {
      // 调整上下顺序
      return h(NButtonGroup, {
        size: 'small'
      }, () => [
          h(
            NTooltip, 
            {
                trigger: 'hover'
              }, 
            {
              trigger: () => h(NButton, {
                size: 'small',
                type: 'primary',
                text: true,
                onClick: () => {
                  if (index > 0) {
                    const temp = data.value[index]
                    data.value.splice(index, 1)
                    data.value.splice(index - 1, 0, temp)
                  }
                },
              }, () => {
                return h(NIcon, {
                  size: 20,
                }, () => h(ChevronUp))
              }),
              default: () => '上移'
            }
          ),
          h(
            NTooltip, 
            {
              trigger: 'hover'
            }, 
            {
              trigger: () => {
                return h(NButton, {
                    size: 'small',
                    type: 'primary',
                    text: true,
                    onClick: () => {
                      if (index < data.value.length - 1) {
                        const temp = data.value[index]
                        data.value.splice(index, 1)
                        data.value.splice(index + 1, 0, temp)
                      }
                    },
                  }, () => {
                    return h(NIcon, {
                      size: 20,
                    }, () => h(ChevronDown))
                  },
                )
              },
              default: () => '下移'
            }
          ),
          h(
            NTooltip,
            {
              trigger: 'hover'
            },
            {
              trigger: () => {
                return h(NButton, {
                    size: 'small',
                    type: 'error',
                    text: true,
                    onClick: () => {
                      data.value.splice(index, 1)
                    },
                  }, () => {
                    return h(NIcon, {
                      size: 20,
                    }, () => h(Trash))
                  }
                )
              },
              default: () => '删除'
            }
          )
        
        ]
      )
    }
  }
]


const addNewParam = () => {
  // 判断如果有一个参数未填写名称，则不允许添加
  if (data.value.some(item => !item.name)) {
    return
  }
  data.value.push({
    name: '',
    description: '',
    type: 'string',
    defaultValue: ''
  })
}


const confirm = () => {
  emit('update:params', data.value)
  visible.value = false
}

onMounted(() => {
  data.value = props.params
})
</script>

<template>
  <n-modal v-model:show="visible" preset="card" title="参数设置" :bordered="false" style="width: 600px;" :mask-closable="false">
    <div class="">
      <div>
        <n-data-table :columns="columns" :data="data" />
      </div>
      <div>
        <n-tooltip>
          <template #trigger>
            <n-button block size="small" @click="addNewParam">
              <template #icon>
                <n-icon>
                  <Plus />
                </n-icon>
              </template>
            </n-button>
          </template>
          <span>添加新参数</span>
        </n-tooltip>
      </div>
    </div>
    
    <template #footer>
      <div class="flex justify-end">
        <n-button type="primary" size="small" @click="confirm">确认</n-button>
        <n-button text class="ml-8px" @click="visible = false" size="small">取消</n-button>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>

</style>