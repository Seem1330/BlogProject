import React, {useId} from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = 'text',
    placeholder,
    className = '',
    error,
    ...props
}, ref) {  //ref is used to get the value of input field
    const id = useId()
    return (
        <div className='w-full'>
            {label && (<label htmlFor={id} className='inline-block mb-1 pl-1'>{label}</label>)}
            <input
            type={type}
            className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50
                 duration-200 border border-gray-200 w-full ${className}`}
            ref={ref} // ref is used to get reference of the input field inside the parent component.for that purpose we use forwardRef
            {...props}
            id={id} // id is used to link the label with the input field 
            />
        </div>
    )
})

export default Input