"use client"
import { FaCircleCheck } from "react-icons/fa6";
import { MdError } from "react-icons/md";
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const {variant}=props
        return (
          <Toast key={id} {...props}>
            <div className="grid">
              {
              title && 
              <ToastTitle>
                {variant=="success" && <FaCircleCheck className="my-auto mr-2" size={20} />}
                {variant=="destructive" && <MdError className="my-auto mr-2" size={20} />} 
                {title}
              </ToastTitle>
              }
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
