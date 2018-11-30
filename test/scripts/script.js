module.exports = (acyort) => {
  function d() {
    acyort.outputHTML({
      template: 'index',
      path: 'index.html',
      data: {
        zero: 0,
        one: 1,
        other: 10,
      },
    })
    acyort.copySource()
  }

  acyort.store.set('key', 10)

  acyort.workflow.register(d)

  acyort.helper.register('_h5', function h5() {
    const key = acyort.store.get('key')
    const number = this.one
    return `This is h${key}, not h${number}`
  })
}
