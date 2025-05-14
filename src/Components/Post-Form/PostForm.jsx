import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import dbService from '../../appwrite/config'
import { Button, Input, RTE, Select } from "../index.js";


function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active'
        },
    })
    const navigate = useNavigate()
     const userData = useSelector((state) => state.auth.userData);
     // here  made mistake that previously it was state.user.userData
    // first thing if user has submitted the form then he has passed the data. it has 2 cases
    //1. if post has value then update 
    //2. if post has not value then create new entry

    const submit = async (data) => {
        if (!userData || !userData.$id) {
        alert("You must be logged in to submit a post.");
        return;
    }

        if (post) {
            const file = data?.image[0] ? await dbService.uploadFile(data.image[0],userData?.$id) : null
            if (file) {
                dbService.deleteFile(post.featuredImage)
            }
            const dbPost = await dbService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : post.featuredImage  // fall back to old image if no new one
            });
            if (dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        } else {
            // create new
            console.log('here creating new :')
         //   console.log('Current user ID:', user.$id); // get this from account.get()
            const file = await dbService.uploadFile(data.image[0], userData?.$id)
            if (file && file.$id) {
                data.featuredImage = file.$id
                console.log('userid',userData?.$id);
                const dbPost = await dbService
                    .createPost({ ...data, userId:userData?.$id || 'unknown user' });
                if (dbPost) {

                    console.log('navigate to /post/${dbPost.$id}')
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }

    const slugTransForm = useCallback((value) => {
        if (value && typeof value === 'string')
            return value.trim().toLowerCase().replace(/\s/g, '-')

        return ''
    }, [])

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransForm(value.title, { shouldValidate: true }));
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, slugTransForm, setValue])

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransForm(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={dbService.getFilePreview(post?.featuredImage)}
                            alt={post?.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default PostForm