import React, {useEffect, useState} from 'react'
import { Container, PostForm } from '../Components'
import dbService from '../appwrite/config'
import { useNavigate, useParams } from 'react-router-dom'

function EditPost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if(slug){
            dbService.getPostById(slug).then((post) => {
                if(post){
                   setPosts(post) 
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])


  return post? (
    <div className='w-full py-8'> 
    <Container>
        <PostForm post={post}/>
    </Container>
    </div>
  ) : null
}

export default EditPost