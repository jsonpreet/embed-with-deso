import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { Shimmer } from '@/components/shimmer';
import axios from 'axios';
import Post from './post';
import { useScript } from '@/lib/utils';
import * as ga from '@/lib/ga'


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
            ga.event({
                action: "set new post id",
                params : {
                    post_id: router.query.id
                }
            })
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
                <title>Embed DeSo Posts On Your Website - With DeSo</title>
            </Head>
            <style jsx global>
                {`
                    body{
                        font-family:-apple-system,BlinkMacSystemFont,Helvetica Neue,sans-serif;
                    }
                `}
            </style>
            <div className='jsx-790afad6ff862db min-w-[360px] sm:min-w-[448px] md:min-w-[500px] justify-center items-center mx-auto flex-row'>
                {loading && <div className='flex-row flex text-black justify-center items-center mx-auto max-w-[500px]'>
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

