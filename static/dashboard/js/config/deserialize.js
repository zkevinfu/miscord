export default function deserialize (field, data) {
  const { type } = field

  if (type === 'text') field.value = data
  if (type === 'checkbox') field.checked = Boolean(data)
  if (type === 'textarea') field.value = data.join('\n')
  if (type === 'select-one') {
    $(field).val(data)
    $(field).trigger('change')
  }
}
