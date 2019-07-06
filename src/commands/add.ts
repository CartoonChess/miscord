import Command from './Command'
import Connection from '../Connection'

export default new Command(async ([ name ]) => {
  if (connections.has(name)) return `Connection \`${name}\` already exists!`

  await new Connection(name).save()

  return `Connection \`${name}\` was added successfully!`
}, {
  argc: 1,
  usage: `add <connection name>`,
  example: `add test-connection`
})
