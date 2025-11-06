import React, {useRef, useEffect, useCallback} from "react"
import {
  Card,
  Grid,
  Input,
  Text
} from '@nextui-org/react'
import { IoIosCloseCircleOutline } from "react-icons/io"
import {v4 as uuid} from 'uuid'
import { useKeypress } from '../../hooks/useKeypress'

const DictionaryTermForm = ( { termItems, setTermItems } ) => {
  const termRefs = useRef([])
  const definitionRefs = useRef([])

  useEffect(() => {
    termItems.forEach((ti, index) => {
      termRefs.current[index].value = ti.term
      definitionRefs.current[index].value = ti.definition
    })
  }, [])

  useEffect(() => {
    termRefs.current = termRefs.current.slice(0, termItems.length)
    //setSelectedValue(prev => prev.slice(0, orderItems.length))
    definitionRefs.current = definitionRefs.current.slice(0, termItems.length)
  }, [termItems])

  const onChangeTerm = (index) => {
    setTermItems(prev => {
      prev[index].term = termRefs.current[index].value
      return prev
    })
    //definitionRefs.current[index].focus()
  }

  const onChangeDefinition = (index) => {
    setTermItems(prev => {
      prev[index].definition = definitionRefs.current[index].value
      return prev
    })
  }

  const removeItem = (index) => {
    setTermItems(prev => {
      prev.splice(index, 1)
      return prev.length > 0 ? [...prev] : [{ id: uuid(), term: '', definition: '', isValid: true }]
    })
  }

  useEffect(() => {
    if (termRefs.current.length > 0) {
      termRefs.current.at(-1).focus()
    }
  }, [termItems.length])

  useKeypress(() => {
    if (definitionRefs.current.at(-1) === document.activeElement) {
      setTermItems(prev => [...prev, { id: uuid(), term: '', definition: '', isValid: true }])
    }
    
  }, ['Enter'])

  return (<>
    { termItems.length > 0 && termItems.map((ti, index) =>
      (
        <React.Fragment key={ti.id}>
          <Grid xs={4} >
              <Text
                style={{ paddingBottom: '10px', alignContent: 'end'}}
                size={16}
              > 
                {index+1} 
              </Text>
            <Card.Body style={{ paddingTop: '0px'}}>
              { index == 0 &&
                (<Text
                  size={16}
                  css={{
                    fontWeight: "500",
                  }}
                > 
                  Term
                </Text>
              )}
              <Input
                aria-label="None"
                status={ti.isValid ? 'default' : 'error'}
                css={{ width: "100%" }}
                ref={i => {
                  if (i != null) {
                    termRefs.current[index] = i
                  }
                }}
                onChange={(e) => e.target.value != null && onChangeTerm(index)} 
              />
            </Card.Body>
          </Grid>
          <Grid xs={7}>
            <Card.Body style={{ paddingTop: '0px'}}>
              { index == 0 &&
                (<Text
                  size={16}
                  css={{
                    whiteSpace: "pre-line",
                    fontWeight: "500"
                  }}
                > 
                  Definition
                </Text>
              )}
              <Input
                aria-label="None"
                status={ti.isValid ? 'default' : 'error'}
                css={{ width: "100%" }}
                ref={i => {
                  if (i != null) {
                    definitionRefs.current[index] = i
                  }
                }}
                onChange={(e) => e.target.value != null && onChangeDefinition(index)}
              />
            </Card.Body>
            <IoIosCloseCircleOutline style={{alignSelf: 'flex-end', marginBottom: '15px'}} size={50} onClick={() => removeItem(index)}/>
          </Grid>
        </React.Fragment>
      )
    )}
  </>)
}

export default DictionaryTermForm