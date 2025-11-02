import { Grid, Button } from '@nextui-org/react'
import DictionaryTermForm from './DictionaryTermForm'
import {v4 as uuid} from 'uuid'

const EditDictionaryModuleForm = ({ termItems,  setTermItems, saveTermItems }) => {
  
  const addTermItem = () => {
    setTermItems(prev => [...prev, { id: uuid(), term: '', definition: '', isValid: true }])
  }

  return (
    <>
      <Grid.Container justify="center" >
        <DictionaryTermForm termItems={termItems} setTermItems={setTermItems} />
      </Grid.Container>
      <Grid.Container justify="space-between">
        <Button auto shadow color="success" onPress={saveTermItems}>
          Save
        </Button>
        <Button auto shadow color="secondary" onPress={addTermItem}>
          Add Order Item
        </Button>
      </Grid.Container>
    </>
  )
}

export default EditDictionaryModuleForm

