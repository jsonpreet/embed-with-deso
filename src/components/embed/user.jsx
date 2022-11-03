import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { Shimmer } from '@/components/shimmer';
import axios from 'axios';
import { useScript } from '@/lib/utils';
import * as ga from '@/lib/ga'
import { Profile } from '@/components/profile';


const UserEmbed = ({username}) => {
    const router = useRouter()
    if (!router) return null
    const [loading, setLoading] = React.useState(false)
    const [profile, setProfile] = React.useState('')
    const [exchange, setExchange] = React.useState()
    const [followers, setFollowers] = React.useState(0)
    const [following, setFollowing] = React.useState(0)
    const [nodes, setNodes] = React.useState({ '1': { 'Name': 'DeSo', 'URL': 'https://node.deso.org', 'Owner': 'diamondhands' } });
    useScript('https://embed.withdeso.com/iframeResizer.contentWindow.min.js');

    React.useEffect(() => {
        if (username !== '' && username !== undefined) {
            setLoading(true)
            fetchProfile(username)
            getExchangeRate()
            getAppState()
            getFollowers(username)
            getFollowing(username)
        }
    }, [username])



    const getExchangeRate = async () => {
        const { data } =  await axios.get(`https://node.deso.org/api/v0/get-exchange-rate`)
        setExchange(data)
    }

    const getAppState = async () => {
        const request = {
            "PublicKeyBase58Check": '',
        }
        const { data } =  await axios.post(`https://node.deso.org/api/v0/get-app-state`,request)
        if (data) {
            setNodes(data.Nodes)
        } else {
            setNodes({'1' : {'Name': 'DeSo', 'URL': 'https://node.deso.org', 'Owner': 'diamondhands'}})
        }
    }

    const fetchProfile = async (id) => {
        const request = {
            "Username": `${id}`,
        }
        const { data } = await axios.post(`https://node.deso.org/api/v0/get-single-profile`, request)
        if (data && data.Profile) {
            setProfile(data.Profile)
            setLoading(false)
        }
    }

    const getFollowers = async (username) => {
        const request = {
            "PublicKeyBase58Check": ``,
            "Username": `${username}`,
            "GetEntriesFollowingUsername": true,
        }
        const { data } =  await axios.post(`https://node.deso.org/api/v0/get-follows-stateless`,request)
        if (data) {
            setFollowers(data.NumFollowers)
        }
    }

    const getFollowing = async (username) => {
        const request = {
            "PublicKeyBase58Check": ``,
            "Username": `${username}`,
            "GetEntriesFollowingUsername": false,
        }
        const { data } =  await axios.post(`https://node.deso.org/api/v0/get-follows-stateless`,request)
        if (data) {
            setFollowing(data.NumFollowers)
        }
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
                {(!loading && profile) &&
                    <Profile profile={profile} exchangeRate={exchangeRate} followers={followers} following={following} nodes={nodes} />
                }
            </div>
        </>
    )
}
 
export default UserEmbed

