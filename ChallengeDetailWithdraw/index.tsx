import { Dialog, Transition } from '@headlessui/react'
import { Player } from '@lottiefiles/react-lottie-player'
import BigNumber from 'bignumber.js'
// @ts-ignore
import { toPng } from 'html-to-image'
import { get, isEmpty } from 'lodash'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, Fragment, useCallback, useRef } from 'react'
import { isMobile } from 'react-device-detect'
import { useSelector } from 'react-redux'

import CustomAvatar from '@/components/Avatar/index'
import { RootState } from '@/store'
import { getCryptoAmountFormatted, newChallengeMode } from '@/util/challenge'
import { websiteUrl } from '@/util/config'
import { ParticipantInterface, TokenInterface } from '@/util/types'

interface ChallengeDetailWithdrawInterface {
  date: string
  wonAmount: any
  didIWin: boolean
  betTitle: string
  earnAmount: number
  isLoading: boolean
  currency: TokenInterface
  userParticipation: ParticipantInterface
}

const ChallengeDetailWithdraw = ({
  date,
  didIWin,
  currency,
  betTitle,
  isLoading,
  wonAmount,
  earnAmount,
  userParticipation
}: ChallengeDetailWithdrawInterface) => {
  const { userData } = useSelector((state: RootState) => state.login)
  const { challengeMetrics } = useSelector((state: RootState) => state.challenges)

  const [isOpen, setIsOpen] = useState(false)
  const currentPage = usePathname()

  const isGroupChallenge = get(challengeMetrics, 'challengeResp.challengeMode', '') === newChallengeMode.group

  const getOdds = () => {
    if (
      !isGroupChallenge &&
      !isEmpty(challengeMetrics) &&
      get(challengeMetrics, 'odds', 0) !== '100' &&
      get(challengeMetrics, 'odds', 0) !== '-100' &&
      get(challengeMetrics, 'odds', 0) !== '0' &&
      get(challengeMetrics, 'odds', 0) !== -100 &&
      get(challengeMetrics, 'odds', 0) !== 100 &&
      get(challengeMetrics, 'odds', 0) !== 0
    ) {
      return challengeMetrics.odds > 100 ? `+${challengeMetrics.odds}` : challengeMetrics.odds
    }

    return ''
  }

  const dataURLtoFile = (dataurl: any, filename: any) => {
    var arr = dataurl.split(','),
      mimeType = arr[0].match(/:(.*?);/)[1],
      decodedData = atob(arr[1]),
      lengthOfDecodedData = decodedData.length,
      u8array = new Uint8Array(lengthOfDecodedData)
    while (lengthOfDecodedData--) {
      u8array[lengthOfDecodedData] = decodedData.charCodeAt(lengthOfDecodedData)
    }
    return new File([u8array], filename, { type: mimeType })
  }

  const shareFile = (file: File, title: string, text: string) => {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        files: [file],
        title,
        text
      })
    }
  }

  const ref = useRef<HTMLDivElement>(null)

  const download = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true, pixelRatio: 3 }).then((dataUrl: any) => {
      if (isMobile) {
        const file = dataURLtoFile(dataUrl, 'bet-' + challengeMetrics.challengeResp.inviteCode + '.png')
        shareFile(file, 'xyz', 'I won my bet on xyz! - ' + websiteUrl + currentPage.substring(1))
      } else {
        const link = document.createElement('a')
        link.download = 'bet-' + challengeMetrics.challengeResp.inviteCode + '.png'
        link.href = dataUrl
        link.click()
      }
    })
  }, [ref, challengeMetrics, currentPage])

  return (
    <>
      {!isLoading && didIWin && earnAmount !== 0 && (
        <>
          <div className='w-full rounded-md bg-card py-6 md:py-4 px-4 mt-8 flex flex-col relative'>
            <div className='flex items-center w-full pr-16'>
              <div className='mr-2 w-[80px] h-[80px] md:h-[100px] md:w-[100px] flex items-center justify-center'>
                <Player
                  autoplay
                  keepLastFrame={true}
                  speed={0.4}
                  renderer='svg'
                  controls={false}
                  src='https://lottie.host/d2f7f40f-ded2-4794-8deb-fb58185f30fe/r5FIGG7v5Z.json'
                  className='w-full m-auto float'
                />
              </div>

              <div className='flex flex-col'>
                <label className='font-title text-[1.15rem]'>
                  You won {userData?.firstName ? userData?.firstName : ''}!
                </label>
                <label className='font-body text-[1rem] leading-[1.8rem] mt-1 mb-1'>
                  <b className='font-semibold text-[1.2rem]'>Congrats on winning {earnAmount}.</b> <br />
                  <Link href='/app/home' className='underline underline-offset-4'>
                    Go home to withdraw
                  </Link>
                </label>
              </div>
            </div>

            <button
              className='group hover bg-[#162036] hover:brightness-125 w-[46px] h-[46px] rounded-full flex items-center justify-center hover:cursor-pointer absolute top-0 bottom-0 m-auto right-4 z-30 transition'
              onClick={() => setIsOpen(true)}
            >
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='22'>
                <path
                  fill='#FFF'
                  fill-rule='nonzero'
                  d='M2 22c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 0 20V9c0-.55.196-1.02.588-1.412A1.926 1.926 0 0 1 2 7h3v2H2v11h12V9h-3V7h3c.55 0 1.02.196 1.412.588.392.391.588.862.588 1.412v11c0 .55-.196 1.02-.588 1.413A1.926 1.926 0 0 1 14 22H2Zm5-7V3.825l-1.6 1.6L4 4l4-4 4 4-1.4 1.425-1.6-1.6V15H7Z'
                />
              </svg>
            </button>
          </div>

          <Transition show={isOpen} as={Fragment}>
            <Dialog
              as='div'
              className='relative z-30'
              onClose={() => {
                setIsOpen(false)
              }}
            >
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-300'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='fixed inset-0 bg-darkest bg-opacity-90' />
              </Transition.Child>

              <div className='fixed inset-0 overflow-y-auto'>
                <div className='flex min-h-full items-center justify-center p-6 text-center'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0 scale-95'
                    enterTo='opacity-100 scale-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100 scale-100'
                    leaveTo='opacity-0 scale-95'
                  >
                    <Dialog.Panel className='max-w-[400px] md:max-w-[500px] gradient-border text-white flex flex-col transform-gpu w-full rounded-lg bg-card bg-cover bg-center bg-[url("/assets/images/website/modal-bg.png")] border-2 border-darkest outline outline-2 outline-offset-2 outline-[#162036] p-6 sm:p-8 md:p-12 transition-all'>
                      <button
                        onClick={() => {
                          setIsOpen(false)
                        }}
                        className='p-2 absolute outline-none text-white top-4 right-4 hover:bg-white/[.05] cursor-pointer rounded-lg transition ease-out hover:-rotate-90'
                      >
                        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='w-8'>
                          <g fill='currentColor' fillRule='evenodd'>
                            <path d='M19 3.586 20.414 5l-7 7 7 7L19 20.414l-7-7-7 7L3.586 19l7-7-7-7L5 3.586l7 7 7-7Z' />
                          </g>
                        </svg>
                      </button>

                      <Dialog.Title className='font-display text-white text-[1.4rem] md:text-2xl mb-6 w-full text-center'>
                        Share Your Win
                      </Dialog.Title>

                      <button
                        onClick={download}
                        className='m-auto mb-6 w-fit flex items-center justify-center outline-0 btn !opacity-100 bg-gradient-to-t from-darkRed to-red hover:from-darkRed hover:to-darkRed active:from-red active:to-darkRed shadow-[inset_0_2px_0px_0px_rgba(255,255,255,0.15),inset_0_-2px_0px_0px_rgba(0,0,0,0.15)]'
                      >
                        {isMobile ? 'Share' : 'Download'}
                        <svg
                          className='scale-90 md:scale-100 ml-2 text-white -mr-1'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 -960 960 960'
                          width='24'
                        >
                          {isMobile ? (
                            <path
                              fill='currentColor'
                              d='M240-40q-33 0-56.5-23.5T160-120v-440q0-33 23.5-56.5T240-640h120v80H240v440h480v-440H600v-80h120q33 0 56.5 23.5T800-560v440q0 33-23.5 56.5T720-40H240Zm200-280v-447l-64 64-56-57 160-160 160 160-56 57-64-64v447h-80Z'
                            />
                          ) : (
                            <path
                              fill='currentColor'
                              d='M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z'
                            />
                          )}
                        </svg>
                      </button>

                      <div className='rounded-md flex border-2 border-[#162036] overflow-hidden m-auto w-full sm:w-fit'>
                        <div
                          ref={ref}
                          className='aspect-square max-w-[360px] md:max-w-[400px] sm:w-[360px] md:w-[400px] px-[15px] py-[15px] xs:py-[22px] select-none flex flex-col w-full bg-card'
                        >
                          <svg
                            className='m-auto mt-0 h-[22px] xs:h-[30px]'
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 174 30'
                          >
                            <defs>
                              <linearGradient id='d' x1='50%' x2='50%' y1='0%' y2='100%'>
                                <stop offset='0%' stopColor='#FF4343' />
                                <stop offset='100%' stopColor='#FF2F2F' />
                              </linearGradient>
                            </defs>
                            <g fill='none' fillRule='evenodd'>
                              <path
                                fill='url(#d)'
                                d='M23.394 0c2.026 0 3.995.399 5.85 1.185a14.94 14.94 0 0 1 4.771 3.223 14.95 14.95 0 0 1 3.21 4.78 14.908 14.908 0 0 1 1.169 5.854 14.904 14.904 0 0 1-1.193 5.827 14.95 14.95 0 0 1-3.215 4.752 14.946 14.946 0 0 1-4.763 3.203A14.905 14.905 0 0 1 23.393 30H9.245l-.996-2.718-6.208-16.95L0 4.764h5.53L3.864 0h19.53Zm0 4.143H9.702l1.667 4.764H5.931l6.208 16.95h11.255a10.82 10.82 0 0 0 7.665-3.17 10.825 10.825 0 0 0 3.19-7.657c.018-6.008-4.848-10.887-10.855-10.887Zm-.159 4.764a6.16 6.16 0 0 1 4.369 1.81 6.178 6.178 0 0 1-4.368 10.546H15.69L11.37 8.907h11.865Zm0 4.144h-6.027l1.423 4.068h4.604a2.036 2.036 0 0 0 2.034-2.034 2.035 2.035 0 0 0-2.034-2.034Z'
                              />
                              <path
                                fill='currentColor'
                                fillRule='nonzero'
                                d='M54.256 9.023c2.295 0 4.004.472 5.13 1.416 1.124.944 1.686 2.49 1.686 4.638 0 2.148-.56 3.694-1.678 4.638-1.12.943-2.832 1.415-5.138 1.415H45.15V9.023h9.106Zm-4.731 3.205v5.698h3.578c1.04 0 1.828-.226 2.365-.679.537-.452.806-1.175.806-2.17 0-.995-.269-1.718-.806-2.17-.537-.453-1.325-.679-2.365-.679h-3.578Zm29.651-3.205v6.817c0 1.424-.305 2.558-.915 3.4-.61.842-1.484 1.438-2.62 1.789-1.136.35-2.558.525-4.265.525-1.707 0-3.128-.175-4.264-.525-1.136-.35-2.01-.944-2.62-1.78-.61-.837-.916-1.973-.916-3.409V9.023h4.375v6.698c0 .87.294 1.498.882 1.882.588.385 1.435.577 2.543.577 1.097 0 1.942-.192 2.535-.577.594-.384.89-1.011.89-1.882V9.023h4.375Zm7.201 4.596h8.97v2.628h-8.97v1.95h9.547v2.933H82.002V9.023h13.752v2.866h-9.377v1.73ZM98.53 21.13V9.023h4.375v8.75h9.462v3.357H98.529Zm32.026-12.107V21.13h-5.087l-6.36-7.24h-.1v7.24h-4.155V9.023h5.155l6.274 7.14h.118v-7.14h4.155Zm11.253-.423c2.905 0 5.095.53 6.57 1.593 1.476 1.063 2.214 2.69 2.214 4.884 0 2.193-.738 3.82-2.213 4.883-1.476 1.063-3.666 1.594-6.571 1.594-2.894 0-5.078-.531-6.554-1.594-1.475-1.062-2.212-2.69-2.212-4.883s.737-3.82 2.212-4.884c1.476-1.062 3.66-1.593 6.554-1.593Zm0 9.665c1.323 0 2.317-.274 2.984-.823.667-.548 1-1.336 1-2.365 0-1.029-.333-1.817-1-2.365-.667-.549-1.661-.823-2.984-.823s-2.315.274-2.976.823c-.661.548-.992 1.336-.992 2.365 0 1.029.33 1.817.992 2.365.661.549 1.653.823 2.976.823Zm22.954 2.865-1.967-7.342h-.12l-1.95 7.342h-5.357l-3.68-12.107h4.714l1.916 7.444h.119l1.967-7.444h4.68l1.967 7.444h.118l1.933-7.444h4.68l-3.747 12.107h-5.273Z'
                              />
                            </g>
                          </svg>

                          <div className='bg-[#1D283F]/70 rounded-sm overflow-hidden w-full relative'>
                            <div className='p-4'>
                              <div className='leading-5 xs:leading-6 text-left flex justify-between mb-2 xs:mb-3'>
                                {/* if bet has no odds or isn't pick'em use 'max-w-full' class instead */}
                                <div className='flex-1 max-w-[calc(100%-100px)]'>
                                  <label className='text-base flex'>Stake</label>
                                  <label className='flex font-display text-base xs:text-xl'>
                                    <span className='truncate block mr-2'>
                                      {getCryptoAmountFormatted(
                                        BigNumber(userParticipation.participationValueQty).toNumber(),
                                        currency?.tokenName ? currency?.tokenName : 'STMX'
                                      )}
                                    </span>
                                    {currency.tokenName}
                                  </label>
                                </div>

                                {getOdds() && (
                                  <div className='text-right flex flex-col items-end'>
                                    <label className='text-base flex'>Odds</label>
                                    <label className='font-display text-base xs:text-xl'>{getOdds()}</label>
                                  </div>
                                )}
                              </div>

                              <div className='leading-6 text-left flex justify-between items-end text-teal'>
                                <div className='flex-1 max-w-[calc(100%-100px)]'>
                                  <label className='text-base flex'>Total Won</label>
                                  <label className='flex font-display text-base xs:text-xl'>
                                    <span className='truncate block mr-2'>
                                      {getCryptoAmountFormatted(
                                        wonAmount,
                                        currency?.tokenName ? currency?.tokenName : 'STMX'
                                      )}
                                    </span>
                                    {currency.tokenName}
                                  </label>
                                </div>

                                <label className='flex-none text-[.7rem] text-center font-title uppercase tracking-widest leading-6 bg-teal/10 px-3 rounded-md min-w-[80px]'>
                                  Winner
                                </label>
                              </div>
                            </div>

                            <div className='h-[4px] w-full relative bg-card before:content-[""] before:w-[26px] before:h-[26px] before:bg-card before:-left-[13px] before:absolute before:rounded-md before:top-0 before:bottom-0 before:m-auto after:content-[""] after:w-[26px] after:h-[26px] after:bg-card after:-right-[13px] after:absolute after:rounded-md after:top-0 after:bottom-0 after:m-auto'>
                              <span className='w-full flex border border-[#242F47] border-dashed mt-[2px]'></span>
                            </div>

                            <div className='bg-[#242F47] p-4 w-full text-left leading-6 xs:leading-[1.6rem]'>
                              <label className='font-display text-[.9rem] truncate max-w-full block'>{betTitle}</label>
                              <label className='block text-base text-white/70'>{date}</label>
                            </div>
                          </div>

                          <label className='text-[.7rem] text-white font-title uppercase tracking-widest leading-5 xs:leading-6 mt-auto'>
                            Bet ID: {challengeMetrics.challengeResp.inviteCode}
                            <br />
                            <div className='w-4 inline-block -mb-[3px]'>
                              {CustomAvatar(userData?.nickname || '', 18)}
                            </div>{' '}
                            {userData?.nickname || ''}
                          </label>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      )}
    </>
  )
}

export default ChallengeDetailWithdraw
