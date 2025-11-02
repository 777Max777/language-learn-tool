import { useState, useRef, useCallback, useEffect } from "react"
import {
  Input,
  Spacer,
  Text,
  Button,
  Grid,
  Card
} from '@nextui-org/react'
import { MdKeyboardBackspace } from 'react-icons/md'
import classes from './ConfigureModule.module.css'
import EditDictionaryModuleForm from '../forms/EditDictionaryModuleForm'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'

const ConfigureModule = ({ moduleId, moduleName, moduleTermItems }) => {
  const [isValidName, setIsValidName] = useState(true);
  const [termItems, setTermItems] = useState(moduleTermItems)
  const nameRef = useRef()

  const navigate = useNavigate()
  
  function isEmpty(str) {
    return !str || str.trim().length === 0;
  }

  const validateTerms = useCallback(() => {
      if (!termItems && termItems.length == 0) {
        return
      }

      setTermItems(prev => {
        let isValidTerms = true
        prev.forEach(ti  => {
          if (!ti.isValid && !isEmpty(ti.term) && !isEmpty(ti.definition)) {
            ti.isValid = true
          }
          if (isEmpty(ti.term) || isEmpty(ti.definition)) {
            isValidTerms = false
            ti.isValid = false
          }
        })
        return isValidTerms ? prev : [...prev]
      })
  }, [termItems])
  
  const save = useCallback(() => {
      validateTerms()

      const name = nameRef.current.value.trim();
      setIsValidName(name.length > 0);

      if (termItems && termItems.length > 0 
        && !!!termItems.find(ti => !ti.isValid) // когда ни одного невалидного не нашёл, тогда сохраняем
        && name.length > 0) {
          localStorage.setItem(moduleId, JSON.stringify({
            name: name,
            createdAt: new Date(),
            learnedAt: null,
            data: termItems.map(item => {
              return {
                i: nanoid(6),
                learned: false,
                answer: item.term,
                question: item.definition
              }
            })
        }))
        return true
      }
      return false
  }, [termItems, isValidName])

  useEffect(() => {
    nameRef.current.value = moduleName
  }, [])

  const onSaveHandler = () => {
    save()
  }

  const onSaveAndNavigateHandler = useCallback(() => {
    const isSaved = save()
    isSaved && isValidName && navigate(`/course/${moduleId}`)
  }, [termItems, isValidName])

  return (
    <>
      <div>
        <div>
          <Grid.Container>
            <Grid xs={3}>
              <Button
                auto
                color={'default'}
                icon={<MdKeyboardBackspace />}
                onPress={() => navigate('/')}
              >
                List course
              </Button>
            </Grid>
            <Grid xs={6}>
              <Text css={{ textAlign: 'center', width: '100%' }} h1 size={18}>
                Configure module
              </Text>
            </Grid>
            <Grid xs={3}>
              <div className={classes.rightCorner}>
                <Button auto shadow color="primary" onPress={onSaveAndNavigateHandler}>
                  Save and close
                </Button>
              </div>
            </Grid>
          </Grid.Container>
          <Spacer />
          <Card>
            <Card.Body>
              <Input
                status={isValidName ? 'default' : 'error'}
                css={{ width: '100%' }}
                label="Name of module"
                ref={nameRef}
              />
              <Spacer />
              <EditDictionaryModuleForm termItems={termItems} setTermItems={setTermItems} saveTermItems={onSaveHandler} />
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  )
}

export default ConfigureModule