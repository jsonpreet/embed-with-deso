import axios from "axios"
import React from "react"
import Head from 'next/head'
import { useRouter } from 'next/router';
import Image from 'next/future/image';
import Linkify from "linkify-react";
import "linkify-plugin-hashtag";
import "linkify-plugin-mention";
import { calculateDurationUntilNow, dateFormat, nFormatter, useScript } from "@/lib/utils";
import { getEmbedURL, getEmbedWidth, getEmbedHeight } from '@/lib/iframly';
import { CommentIcon, DiamondIcon, LikeIcon, LinkIcon, RePostIcon } from '@/lib/constants';

const Post = ({ post, exchangeRate, profile, nodes, isRepost }) => {
    const [videoEmbed, setEmbed] = React.useState('')
    const [readMore, setReadMore] = React.useState(false)
    const [nftEntry, setNftEntry] = React.useState('')

    React.useEffect(() => {
        const response = getEmbedURL(post.PostExtraData['EmbedVideoURL']);
        setEmbed(response)
        checkLength();
        // if (post.IsNFT) {
        //     getNFTEntries()
        // }
    }, [post])

    const getNFTEntries = async () => {
        const request = {
            "PostHashHex": `${post.PostHashHex}`,
        }
        const { data } =  await axios.post(`https://node.deso.org/api/v0/get-nft-entries-for-nft-post`,request)
        //const response = await deso.posts.getNFTEntries(request);
        if (data) {
            setNftEntry(data)
        }
    }

    const checkLength = () => {
        post.Body.substring(0, 580).length < post.Body.length ? setReadMore(false) : setReadMore(true)
    }

    const node = nodes[post?.PostExtraData?.Node] || nodes[1]

    const nodeURL = (node.URL !== '') ? node.URL : `https://node.deso.org`;

    const LinkifyRenderLink = ({ attributes, content }) => {
        const { href, ...props } = attributes;
        return <a href={href} target='_blank' className='text-[#007bff] hover:text-[#0056b3] hover:underline' rel="noopener noreferrer nofollow" {...props}>{content}</a>;
    };

    const LinkifyOptions = {
        formatHref: {
            hashtag: (href) => `${nodeURL}/hashtag/` + href.substr(1).toLowerCase(),
            mention: (href) => `${nodeURL}/` + href.substr(1).toLowerCase(),
        },
        render: {
            mention: LinkifyRenderLink,
            hashtag: LinkifyRenderLink,
            url: ({ attributes, content }) => {
                return <a {...attributes} className='text-[#007bff] hover:text-[#0056b3] hover:underline' rel="noopener noreferrer nofollow" target="_blank">{content}</a>
            },
        },
        nl2br: true
    };

    const handleClick = (url) => {
        window.open(url, '_blank');
    }

    return (
        <div className={`${isRepost ? `my-2  rounded-xl ` : ``} flex flex-1 bg-white border ${!isRepost ? `hover:bg-gray-50/80` : `hover:bg-gray-100/50`} transition duration-100 border-gray-200 p-[15px] flex-col w-full max-w-xl`}>
            <div onClick={() => handleClick(`${nodeURL}/posts/${post.PostHashHex}`)} rel="noopener noreferrer nofollow" target='_blank' style={{ cursor: 'pointer'}}>
                <div className='flex flex-row items-start w-full'>
                    <div className='flex flex-col w-full'>
                        <div className='flex flex-row items-center'>
                            <div className='mr-2'>
                                <a href={`${nodeURL}/u/${profile?.Username}`} target='_blank' rel="noopener noreferrer nofollow">
                                    <img alt={profile.Username} className='rounded-full' src={profile?.ExtraData?.LargeProfilePicURL || `https://node.deso.org/api/v0/get-single-profile-picture/${profile?.PublicKeyBase58Check}`} width={50} height={50} />
                                </a>
                            </div>
                            <div className='flex flex-row items-center'>
                                <div className='flex flex-col items-start justify-center'>
                                    <div className='flex flex-row items-center'>
                                        <a rel="noopener noreferrer nofollow" href={`${nodeURL}/u/${profile?.Username}`} className='leading-none font-semibold text-black hover:underline hover:text-[#0056b3] text-[15px]' target='_blank'>{profile?.Username}</a>
                                        {profile?.IsVerified && <span className='verified w-4 h-4 ml-[2px]'>Verified</span>}
                                        <span className='bg-gray-100 px-[12px] py-[4px] text-[12px] font-semibold text-gray-700 rounded-full ml-2'>
                                            ~${((profile?.CoinPriceDeSoNanos / 1000000000) * exchangeRate).toFixed(2)}
                                            <a rel="noopener noreferrer nofollow" target="_blank" className='ml-1 hover:text-[#0056b3] text-[#007bff]' href={`${nodeURL}/${profile?.Username}`}>Buy</a>
                                        </span>
                                    </div>
                                    <div className='flex flex-row items-center'>
                                        <a rel="noopener noreferrer nofollow" href={`${nodeURL}/u/${profile?.Username}`} className='text-[#007bff] hover:text-[#0056b3] font-semibold text-[13px] hover:underline' target='_blank'>Follow</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <div className='mt-2 text-[15px] break-words body'>
                               
                                <Linkify options={LinkifyOptions}>
                                    {`${post.Body.substring(0, 580)}...`}
                                </Linkify>
                                {!readMore &&
                                    <a className='ml-1 font-semibold hover:underline' onClick={() => handleClick(`${nodeURL}/posts/${post.PostHashHex}`)} rel="noopener noreferrer nofollow" target='_blank'>
                                        Read More
                                    </a>
                                }
                            </div>
                            {post.ImageURLs && post.ImageURLs.length > 0 &&
                                <div className='mt-2 embed-container'>
                                    <a rel="noopener noreferrer nofollow" href={`${nodeURL}/posts/${post.PostHashHex}`} target='_blank' className='w-full justify-center items-center max-h-[500px] rounded-xl flex overflow-hidden'>
                                        <img className='rounded-xl border border-gray-200 w-full' alt={post.PostHashHex} src={post.ImageURLs[0]}  />
                                    </a>
                                </div>
                            }
                            {post.VideoURLs && post.VideoURLs[0] !== '' &&
                                <div className='mt-2 feed-post__video-container relative pt-[56.25%] w-full rounded-xl max-h-[700px] overflow-hidden'>
                                    <iframe src={post.VideoURLs[0]} className='w-full absolute left-0 right-0 top-0 bottom-0 h-full feed-post__video' allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen></iframe>
                                </div>
                            }
                            {post.PostExtraData?.EmbedVideoURL && post.PostExtraData?.EmbedVideoURL !== '' && videoEmbed !== '' &&
                                <div className='mt-2 embed-container w-full flex flex-row items-center justify-center rounded-xl overflow-hidden'>
                                    <iframe id="embed-iframe" className='w-full flex-shrink-0 feed-post__image' height={getEmbedHeight(videoEmbed)} style={{ maxWidth: getEmbedWidth(videoEmbed) }} src={videoEmbed} frameBorder="0" allow="picture-in-picture; clipboard-write; encrypted-media; gyroscope; accelerometer; encrypted-media;" allowFullScreen ></iframe>
                                </div>
                            }
                            {post.RecloutedPostEntryResponse && post.RecloutedPostEntryResponse !== '' &&
                                <Post post={post.RecloutedPostEntryResponse} exchangeRate={exchangeRate} profile={post.RecloutedPostEntryResponse?.ProfileEntryResponse} nodes={nodes} isRepost={true}/>
                            }
                            {!isRepost &&
                                <div>
                                    <div className='flex flex-row justify-between items-center mt-2 border-b border-gray-300 pb-2'>
                                        <a rel="noopener noreferrer nofollow" href={`${nodeURL}/posts/${post.PostHashHex}`} target='_blank' className='text-gray-600 hover:underline text-[13px]'>{dateFormat(post.TimestampNanos)}</a>
                                        {post.IsNFT && <a rel="noopener noreferrer nofollow" href={`${nodeURL}/posts/${post.PostHashHex}`} target='_blank' className='text-white bg-blue-600 rounded py-1 px-2 hover:underline text-[13px]'>NFT</a>}
                                    </div>
                                    <div className='flex flex-row justify-between items-center mt-2'>
                                        <a rel="noopener noreferrer nofollow" href={`${nodeURL}/posts/${post.PostHashHex}`} target='_blank' className='flex flex-row items-center group'>
                                            <span className='text-[#0059f7] group-hover:bg-[#0059f7]/10 flex flex-col items-center justify-center z-10 meta_icon w-[30px] h-[30px] rounded-full'>
                                                <span className='w-[20px] h-[20px] z-20 inline-block fill-transparent rounded-full stroke-current stroke-2' style={{strokeLinecap: 'round', strokeLinejoin: 'round'}}>
                                                    <CommentIcon/>
                                                </span>
                                            </span>
                                            <span className='text-gray-600 font-semibold group-hover:text-[#0059f7] text-[14px] ml-[4px]'>{nFormatter(post.CommentCount)}</span>
                                        </a>
                                        <a rel="noopener noreferrer nofollow" href={`${nodeURL}/posts/${post.PostHashHex}`} target='_blank' className='flex flex-row items-center group'>
                                            <span className='text-green-600 group-hover:bg-green-100 flex flex-col items-center justify-center z-10 meta_icon w-[30px] h-[30px] rounded-full'>
                                                <span className='w-[20px] h-[20px] z-20 inline-block fill-transparent rounded-full stroke-current stroke-2' style={{strokeLinecap: 'round', strokeLinejoin: 'round'}}>
                                                    <RePostIcon />
                                                </span>
                                            </span>
                                            <span className='text-gray-600 font-semibold group-hover:text-green-600 text-[14px] ml-[4px]'>{nFormatter((post.RepostCount + post.QuoteRepostCount))}</span>
                                        </a>
                                        <a rel="noopener noreferrer nofollow" href={`${nodeURL}/posts/${post.PostHashHex}`} target='_blank' className='flex flex-row items-center group'>
                                            <span className='text-[#fe3537] group-hover:bg-[#fe3537]/10 flex flex-col items-center justify-center z-10 meta_icon w-[30px] h-[30px] rounded-full'>
                                                <span className='w-[20px] h-[20px] z-20 inline-block fill-transparent rounded-full stroke-current stroke-2' style={{strokeLinecap: 'round', strokeLinejoin: 'round'}}>
                                                    <LikeIcon />
                                                </span>
                                            </span>
                                            <span className='text-gray-600 font-semibold group-hover:text-[#fe3537] text-[14px] ml-[4px]'>{nFormatter(post.LikeCount)}</span>
                                        </a>
                                        <a rel="noopener noreferrer nofollow" href={`${nodeURL}/posts/${post.PostHashHex}`} target='_blank' className='flex flex-row items-center group'>
                                            <span className='text-[#0056b3] group-hover:bg-[#0056b3]/10 flex flex-col items-center justify-center z-10 meta_icon w-[30px] h-[30px] rounded-full'>
                                                <span className='w-[20px] h-[20px] z-20 inline-block fill-transparent rounded-full stroke-current stroke-2' style={{strokeLinecap: 'round', strokeLinejoin: 'round'}}>
                                                    <DiamondIcon />
                                                </span>
                                            </span>
                                            <span className='text-gray-600 font-semibold group-hover:text-[#0056b3] text-[14px] ml-[4px]'>{nFormatter(post.DiamondCount)}</span>
                                        </a>
                                        <a rel="noopener noreferrer nofollow" href={`${nodeURL}/posts/${post.PostHashHex}`} target='_blank' className='flex flex-row items-center'>
                                            <span className='text-gray-500 group-hover:bg-[#0059f7]/10 flex flex-col items-center justify-center z-10 meta_icon w-[30px] h-[30px] rounded-full'>
                                                <span className='w-[20px] h-[20px] z-20 inline-block fill-transparent rounded-full stroke-current stroke-2' style={{strokeLinecap: 'round', strokeLinejoin: 'round'}}>
                                                    <LinkIcon />
                                                </span>
                                            </span>
                                            <span className='text-gray-600 font-semibold group-hover:text-[#0059f7] text-[14px] ml-[4px]'>{calculateDurationUntilNow(post.TimestampNanos)}</span>
                                        </a>
                                    </div>
                                </div>
                            }
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post