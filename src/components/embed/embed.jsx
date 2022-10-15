import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { Shimmer } from '@/components/shimmer';
import axios from 'axios';
import Post from './post';


const Embed = () => {
    const router = useRouter()
    if (!router) return null
    const [suggestions, setSuggestions] = React.useState(false)
    const [results, setResults] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState(false)
    const [postID, setPostID] = React.useState('')
    const [post, setPost] = React.useState('')
    const [exchange, setExchange] = React.useState();
    const [isLoaded, setLoaded] = React.useState(false);
    const [nodes, setNodes] = React.useState({ '1': { 'Name': 'DeSo', 'URL': 'https://node.deso.org', 'Owner': 'diamondhands' } });
    useScript('/iframeResizer.contentWindow.min.js');

    React.useEffect(() => {
        if (router.query.id !== undefined && router.query.id !== '') {
            setPostID(router.query.id)
        } else if(router.query.id === '') {
            router.push('/')
        }
    }, [router]);

    React.useEffect(() => {
        if (postID !== '' && postID !== undefined) {
            setLoading(true)
            fetchPost(postID)
            getExchangeRate()
            getAppState()
        }
    }, [postID])

    const getExchangeRate = async () => {
        //const response = await deso.metaData.getExchangeRate();
        const { data } =  await axios.get(`https://node.deso.org/api/v0/get-exchange-rate`)
        setExchange(data)
    }

    const getAppState = async () => {
        const request = {
            "PublicKeyBase58Check": '',
        }
        //const response = await deso.metaData.getAppState(request);
        const { data } =  await axios.post(`https://node.deso.org/api/v0/get-app-state`,request)
        if (data) {
            setNodes(data.Nodes)
        } else {
            setNodes({'1' : {'Name': 'DeSo', 'URL': 'https://node.deso.org', 'Owner': 'diamondhands'}})
        }
    }

    const fetchPost = async (id) => {
        const request = {
            "PostHashHex": `${id}`,
        }
        const { data } =  await axios.post(`https://node.deso.org/api/v0/get-single-post`,request)
        //const response = await deso.posts.getPostsForPublicKey(request);
        if (data && data.PostFound) {
            setPost(data.PostFound)
            setLoading(false)
        }
        // if (deso) {
        //     const response = await deso.posts.getSinglePost(request);
        //     if (response) {
        //         setPost(response.PostFound)
        //         setLoading(false)
        //     } else {
        //         console.log(response);
        //     }
        // }
    }
    const exchangeRate = exchange?.USDCentsPerDeSoExchangeRate / 100
    return (
        <>
            <Head>
                <title>Embed Post with DESO</title>
            </Head>
            <style jsx global>
                {`
                    body{
                        font-family:-apple-system,BlinkMacSystemFont,Helvetica Neue,sans-serif;
                    }
                `}
            </style>
            <div className='w-full min-w-[400px] md:min-w-[500px] flex-row items-start justify-between'>
                {loading && <div className='bg-white flex-row flex text-black transition duration-100 border-gray-200 rounded-xl w-full max-w-[500px]'>
                    <Shimmer />
                </div>}
                {(!loading && post) &&
                    <Post isRepost={false} post={post} exchangeRate={exchangeRate} profile={post?.ProfileEntryResponse} nodes={nodes} />
                }
            </div>
        </>
    )
}
 
export default Embed

