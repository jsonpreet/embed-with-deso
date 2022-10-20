import { useRouter } from 'next/router';
import { UserEmbed, PostEmbed } from '@/components/embed';
import React from 'react';


const Embed = () => {
    const router = useRouter()
    if (!router) return null
    const [prefix, setPrefix] = React.useState('')
    const [postID, setPostID] = React.useState('')

    React.useEffect(() => {
        if (router.query.slug !== undefined && router.query.slug !== '') {
            setPrefix(router.query.slug[0])
            setPostID(router.query.slug[1])
            
        }
    }, [router]);
    
    return (
        <>
            {prefix === 'posts' ? <PostEmbed postID={postID} /> : <UserEmbed username={postID} />}
        </>
    )
}
 
export default Embed

