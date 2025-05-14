import React from 'react'
import { Controller } from "react-hook-form"
import { Editor } from '@tinymce/tinymce-react'

export default function RTE({name, control, label, defaultValue=""}) {
    // control -> comes from react hook form and its responsible for managing the form state. control pass when we use the RTE component inside the form
    // name -> name of the field
    //label -> label of the field

  return (
   <div className='w-full'>
    {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
    <Controller
    name={name || "content"} // name of the field
    control={control}  // control gets from parent component, whatever parent element calls it we pass as it is to control
    render={({field: {onChange}}) => (
        <Editor initialValue={defaultValue} // default value of the field
       init={{
        height: 500,
        menubar: true,
        plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
                "anchor",
        ],
        toolbar: 'undo redo | styleselect | bold italic backcolor | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | link image | print preview media fullpage | \
        forecolor backcolor emoticons | help',
         content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
       }}
       onEditorChange={onChange} // onChange is used to get the value of the editor
       />
    )}
    
    />
   </div>
  )
}

