import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Layout } from '@/components/layout'
import { BsArrowRight, BsChevronDown, BsChevronRight } from "react-icons/bs";
import { Header } from '@/components/header';
import { useRouter } from 'next/router';
import { useDetectClickOutside } from 'react-detect-click-outside';
import {CopyToClipboard} from 'react-copy-to-clipboard';
 import { toast, ToastContainer } from 'react-toastify';
import { loadScript, removeQueryParam, useScript } from '@/lib/utils';
import Script from 'next/script';
import IframeResizer from 'iframe-resizer-react'
import axios from 'axios';


const Home = () => {
  const router = useRouter()
  if (!router) return null
  const [postUrl, setPostUrl] = React.useState('')
  const [postID, setPostID] = React.useState('')
  const [suggestions, setSuggestions] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [code, setCode] = React.useState(`<span id="deso-embed" data-post-hash="" /><script src="https://embed.withdeso.com/script.js"></script>`)
  const [copied, setIsCopied] = React.useState(false)
  const [showEmbed, setShowEmbed] = React.useState(false)
  const embedRef = React.useRef(null)
  const iframeRef = React.useRef(null)
  const [nodes, setNodes] = React.useState({ '1': { 'Name': 'DeSo', 'URL': 'https://node.deso.org', 'Owner': 'diamondhands' } });
  const ogKeys = ['BC1YLiUt3iQG4QY8KHLPXP8LznyFp3k9vFTg2mhhu76d1Uu2WMw9RVY', 'BC1YLgk64us61PUyJ7iTEkV4y2GqpHSi8ejWJRnZwsX6XRTZSfUKsop', 'BC1YLgxLrxvq5mgZUUhJc1gkG6pwrRCTbdT6snwcrsEampjqnSD1vck', 'BC1YLj3a3xppVPtAoMAzh1FFYtCTiGomjaA5PRcqS1PVRk8KqDw385y', 'BC1YLh5pKXs8NqaUtN8Gzi3rfoAgG2VWio2NER7baDkG8T2x7wRnSwa', 'BC1YLhyuDGeWVgHmh3UQEoKstda525T1LnonYWURBdpgWbFBfRuntP5'];


  React.useEffect(() => {
    getAppState()
    newPost();
  }, [])


  React.useEffect(() => {
    window.addEventListener('scroll', isSticky);
    return () => {
      window.removeEventListener('scroll', isSticky);
    };
  }, []);

  React.useEffect(() => {
    console.log(router.query)
    if (router.query.url !== undefined && router.query.url !== '') {
      setPostUrl(removeQueryParam(router.query.url))
      setQuery(removeQueryParam(router.query.url))
    }
  }, [router]);

  React.useEffect(() => {
    if (postUrl !== '') {
      const url = removeQueryParam(postUrl)
      router.replace(`?url=${url}`, undefined, { shallow: true })
      setPostID(url.split('/')[4])
    }
  }, [postUrl]);

  React.useEffect(() => {
    //loadScript(script)
    setCode(`<span id="deso-embed" data-post-hash="${postID}" /><script src="https://embed.withdeso.com/script.js"></script>`)
    setShowEmbed(true)
  }, [postID])


  const closeSharePopUp = () => {
      //setSharePopUpOpen(false)
  }
  const shareRef = useDetectClickOutside({ onTriggered: closeSharePopUp, triggerKeys: ['Escape', 'x'], });

  const copy = () => {
    setIsCopied(true);
    toast.success('Copied! Paste this code directly into the HTML portion of your site.', {
        position: "bottom-center",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: false,
        draggable: false,
        closeButton: false,
        progress: undefined,
        theme: "dark",
        icon: true
    });
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

  const newPost = async () => {
    const request = {
      "NumToFetch": 1,
      "PublicKeyBase58Check": `${ogKeys[Math.floor(Math.random() * ogKeys.length)]}`,
    };
    const { data } =  await axios.post(`https://node.deso.org/api/v0/get-posts-for-public-key`,request)
    //const response = await deso.posts.getPostsForPublicKey(request);
    if (data && data.Posts) {
      const post = data.Posts[0];
      const node = nodes[post?.PostExtraData?.Node] || nodes[1]
      const nodeURL = (node.URL !== '') ? node.URL : `https://node.deso.org`;
      const postURL = `${nodeURL}/post/${post.PostHashHex}`;
      setPostUrl(postURL)
      setQuery(postURL)
    }
  }
  
  const isSticky = (e) => {
    // const header = document.querySelector('.header-section');
    // const hero = document.querySelector('.hero-section');
    // const main = document.querySelector('.main-section');
    // const scrollTop = window.scrollY;
    // if (scrollTop >= 425) {
    //   header.classList.add('headerBG');
    // } else {
    //   header.classList.remove('headerBG');
    // }
  };

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (e.target.value.length > 0) {
        moveToEmbed()
        setSuggestions(false)
        setPostUrl(e.target.value)
        setQuery(e.target.value);
    } else {
      setPostUrl('')
      setQuery('')
      setPostID('')
      setSuggestions(true)
    }
  }

  const toggleSuggestions = () => {
    setSuggestions(!suggestions)
  }

  const onResized = (data) => {
    //moveToEmbed()
  }
  
  const moveToEmbed = () => {
    embedRef.current.scrollIntoView()
    window.scrollTo({
        top: 100,
        behavior: 'smooth',
    });
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setLoading(true)
      if (e.target.value.length > 0) {
          moveToEmbed()
          setPostUrl(e.target.value)
          setSuggestions(false)
          setQuery(e.target.value);
      } else {
          setSuggestions(true)
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    setLoading(true)
    const value = e.clipboardData.getData('text/plain')
    if (value.length > 0) {
        moveToEmbed()
        setPostUrl(value)
        setSuggestions(false)
        setQuery(value);
    } else {
        setSuggestions(true)
    }
  }
   
  return (
    <>
      <Head>
        <title>Embed Post with DESO</title>
      </Head>
      <div className='main-section bg-[#031128] bg-gradient-to-br from-[#031128] to-[#0000ff33] w-full flex-col z-10 relative items-start justify-center'>
        <div className='header-section flex flex-row items-start justify-between w-full px-20 py-5'>
          <div className='flex flex-row items-center'>
            <a href='https://deso.com' className='flex flex-row items-center justify-center'>
              <Image src="/logo-deso-white.svg" alt="Deso Logo" width={100} height={35} />
            </a>
            <h3 className='font-semibold ml-2 text-[#daedff]'>/</h3>
            <h3 className='font-semibold ml-2 text-[#daedff]'>Embed</h3>
          </div>
        </div>
        <div className='hero-section flex w-full sm:h-[200px] h-96 relative max-w-4xl mx-auto flex-auto flex-col items-center justify-center px-20 text-center'>
          <h1 className='text-4xl text-[#daedff] my-font font-medium'>What would you like to embed?</h1>
          <div className='flex w-full relative flex-row mt-4'>
            <input
              type='text'
              placeholder='Enter a Deso URL'
              className='bg-white text-sm focus:ring-4 focus:ring-offset-1 focus:ring-[#0099ff] outline-none rounded-full shadow px-4 py-4 text-black w-full block'
              onClick={() => toggleSuggestions()}
              onChange={(e) => handleSearch(e)}
              onKeyPress={(e) => handleKeyPress(e)}
              onPaste={(e) => handlePaste(e)}
              value={query ? query : ''}
            />
            <div className='absolute right-0 top-0'>
              {!query ?
                <button className='bg-white h-[52px] px-4 rounded-tr-full rounded-br-full' onClick={() => toggleSuggestions()}><BsChevronDown size={26} color='#0099ff' /></button>
                :
                <button className='bg-white h-[52px] px-4 rounded-tr-full rounded-br-full' onClick={() => moveToEmbed()}><BsArrowRight size={26} color='#0099ff' /></button>
              }
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col w-full max-w-3xl min-h-[100px] mx-auto items-center pt-10 pb-40 text-center'>
        <div ref={embedRef} className='embed flex-col w-full flex items-center justify-center'>
          <h3 className='text-center text-xl font-medium my-font'>To embed this post on your website, just paste the code below!</h3>
          <div className='flex flex-row w-full mt-4 relative overflow-hidden'>
            <CopyToClipboard text={code} onCopy={() => copy()}>
              <div className='relative overflow-hidden'>
                <code className='bg-white border border-gray-200 focus:ring-4 focus:ring-offset-1 focus:ring-[#0099ff] transition duration-300 whitespace-nowrap cursor-pointer font-sans px-4 py-4 outline-none rounded-full shadow-inner text-black w-full block'>
                  <pre>{code}</pre>
                </code>
                <div className='absolute top-[1px] right-[-1px]'>
                  <button className='bg-[#ffda59] text-[#6d4800] hover:bg-[#ffcf26] font-bold py-4 px-4 rounded-tr-full rounded-br-full'>Copy Code</button>
                </div>
              </div>
            </CopyToClipboard>
          </div>
          {(postID && showEmbed) &&
            <div className='flex flex-row w-full min-w-[400px] md:min-w-[500px] items-center justify-center mt-4 relative overflow-hidden'>
              <IframeResizer
                heightCalculationMethod="lowestElement"
                inPageLinks
                log={false}
                onResized={onResized}
                src={`/embed/${postID}`}
                style={{ minWidth: '500px' }}
              />
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default Home

