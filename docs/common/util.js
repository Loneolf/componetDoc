
import { ElMessage } from 'element-plus'

export function copyString(params) {
  if (!params) {
    ElMessage({
        message: '复制内容不能为空',
        type:'warning'
    })
    return;
  }
    navigator.clipboard.writeText(params).then(() => {
      ElMessage({
          message:`已复制内容:${params}`,
          type:'success'
      })
    }).catch(() => {
      ElMessage({
          message:`已复制内容:${params}`,
          type:'error'
      })
    })
}