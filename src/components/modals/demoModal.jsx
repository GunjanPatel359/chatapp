import { useModal } from '../../../customhooks/zusthook'

const demoModal = () => {
  const { isOpen, type, reloadCom } = useModal()
  const isModelOpen = isOpen && type === 'modal-name'

  if(!isModelOpen){
    return null
  }

  return (
    <>
      {isModelOpen && (
        <>
          <div>Hello</div>
        </>
      )}
    </>
  )
}

export default demoModal