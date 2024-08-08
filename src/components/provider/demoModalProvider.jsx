import { useEffect, useRef, useState } from 'react'
import { useModal } from '../customhooks/zusthook'

const demoModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { isOpen,onClose } = useModal()
  const divRef=useRef()

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return null
  }

  const handleClose=(e)=>{
    if(e.target === divRef.current){
      onClose()
    }
  }
  return (
    <>
      <div
        className={`fixed inset-0 width-[100%] height-[100%] flex justify-center items-center transition-all duration-500 ease-ease-in shadow-2xl ${isOpen
            ? 'backdrop-brightness-50 opacity-100 visible'
            : 'backdrop-brightness-100 opacity-0 invisible'
        }`}
        onClick={handleClose}
        ref={divRef}
      >
        {isOpen && (
          <div className='transition-all duration-500 ease-ease-in w-auto max-h-[600px] overflow-y-scroll flex flex-col bg-white border-2 border-white shadow-2xl rounded-xl text-rose-500'>  

          </div>
        )}
      </div>
    </>
  )
}

export default demoModalProvider