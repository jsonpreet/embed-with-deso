import { useRouter } from 'next/router';
import { UserEmbed, PostEmbed, BlogEmbed } from '@/components/embed';
import React from 'react';


const Embed = () => {
    const router = useRouter()
    if (!router) return null
    const [prefix, setPrefix] = React.useState('')
    const [postID, setPostID] = React.useState('')
    const [postPrefix, setPostPrefix] = React.useState('')

    React.useEffect(() => {
        if (router.query.slug !== undefined && router.query.slug !== '') {
            console.log(router.query)
            setPrefix(router.query.slug[0])
            setPostPrefix(router.query.slug[2])
            setPostID(router.query.slug[1])
            
        }
    }, [router]);
    
    return (
        <>
            {prefix === 'posts' ? <PostEmbed postID={postID} /> : prefix === 'blog' ? <BlogEmbed user={postPrefix} postID={postID}/> : <UserEmbed username={postID} />}
        </>
    )
}
 
export default Embed

