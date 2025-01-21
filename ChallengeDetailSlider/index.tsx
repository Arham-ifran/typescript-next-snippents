import BigNumber from 'bignumber.js'
import { get, isEmpty } from 'lodash'
import { useSelector } from 'react-redux'
import Slider from 'react-slick'
import { Tooltip } from 'react-tooltip'

import { RootState } from '@/store'
import { convertCryptoAmountToUsd, getCryptoAmountFormatted, sliderSettings } from '@/util/challenge'
import { getOddsAmountInCurrentOddsPreference } from '@/util/odds'
import { TokenInterface } from '@/util/types'

interface ChallengeDetailSliderInterface {
  isLoading: boolean
  challengeMetrics: any
  currency?: TokenInterface
  isGroupChallenge: boolean
  numberOfParticipants: number
}

const ChallengeDetailSlider = ({
  currency,
  isLoading,
  isGroupChallenge,
  challengeMetrics,
  numberOfParticipants
}: ChallengeDetailSliderInterface) => {
  const { oddFormat, oddsFormatAvailable } = useSelector((state: RootState) => state.odds)

  const getOddsAmount = () => {
    const oddsAmount = get(challengeMetrics, 'odds', 0)
    return isNaN(oddsAmount) ? 0 : BigNumber(oddsAmount).toNumber()
  }

  return (
    <Slider className='overflow-x-hidden w-[calc(100%+55px)] pl-[22px] -ml-[22px]' {...sliderSettings}>
      {!isEmpty(challengeMetrics) && (
        <div className='!flex'>
          <div className='flex flex-col md:mb-auto'>
            <label className='font-title text-[.85rem] uppercase tracking-widest text-white/50'>Odds</label>
            <label className='font-title text-white text-[1rem]'>
              {isLoading ? (
                <div className='animate-pulse h-[16px] bg-card rounded-md col-span-2 w-[50px] mt-2'></div>
              ) : (
                <>
                  {getOddsAmountInCurrentOddsPreference(
                    getOddsAmount(),
                    isGroupChallenge,
                    oddsFormatAvailable,
                    oddFormat
                  )}
                </>
              )}
            </label>
          </div>

          <div className='w-[2px] h-[60px] bg-card ml-10 mr-6' />
        </div>
      )}

      <div>
        <div className='flex flex-col md:mb-auto'>
          <label className='font-title text-[.85rem] uppercase tracking-widest text-white/50'>Players</label>

          <label className='font-title text-white text-[1rem]'>
            {isLoading || isEmpty(challengeMetrics) ? (
              <div className='animate-pulse h-[16px] bg-card rounded-md col-span-2 w-[50px] mt-2' />
            ) : (
              <>{numberOfParticipants}</>
            )}
          </label>
        </div>

        <div className='w-[2px] h-[60px] bg-card ml-10 mr-6' />
      </div>

      {isGroupChallenge && (
        <div>
          <div className='flex flex-col md:mb-auto'>
            <label className='font-title text-[.85rem] uppercase tracking-widest text-white/50'>Pool Total</label>

            <div className='flex items-center'>
              {isLoading || isEmpty(challengeMetrics) ? (
                <div className='animate-pulse h-[16px] bg-card rounded-md col-span-2 w-[50px] mt-2' />
              ) : (
                <>
                  <label className='font-title text-white text-[1rem]'>{`${getCryptoAmountFormatted(
                    BigNumber(challengeMetrics?.challengeResp?.challengeValueQty).toNumber(),
                    currency?.tokenName ? currency?.tokenName : 'STMX'
                  )} ${currency?.tokenName}`}</label>

                  <button className='poolTotal ml-1 outline-none rounded-md w-5 h-5 inline-flex items-center justify-center cursor-pointer'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='w-5' viewBox='0 -960 960 960'>
                      <path
                        fill='currentColor'
                        d='M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'
                      />
                    </svg>
                  </button>

                  <Tooltip
                    anchorSelect='.poolTotal'
                    place='bottom'
                    noArrow={true}
                    openEvents={{ mouseenter: true, focus: true, click: true }}
                    className='!bg-[#162036] !opacity-100 !rounded-sm !font-base !font-semibold'
                  >
                    {convertCryptoAmountToUsd(
                      BigNumber(challengeMetrics?.challengeResp?.challengeValueQty).toNumber(),
                      currency
                    )}
                  </Tooltip>
                </>
              )}
            </div>
          </div>

          <div className='w-[2px] h-[60px] bg-card ml-10 mr-6' />
        </div>
      )}

      <div>
        <div className='flex flex-col md:mb-auto'>
          <label className='font-title text-[.85rem] uppercase tracking-widest text-white/50'>Currency</label>

          <div className='flex items-center'>
            {isLoading || isEmpty(challengeMetrics) ? (
              <div className='animate-pulse h-[16px] bg-card rounded-md col-span-2 w-[50px] mt-2' />
            ) : (
              <>
                <label className='font-title text-white text-[1rem]'>{currency?.tokenName}</label>

                <button className='network ml-1 outline-none rounded-md w-5 h-5 inline-flex items-center justify-center cursor-pointer'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='w-5' viewBox='0 -960 960 960'>
                    <path
                      fill='currentColor'
                      d='M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'
                    />
                  </svg>
                </button>

                <Tooltip
                  anchorSelect='.network'
                  place='bottom'
                  noArrow={true}
                  openEvents={{ mouseenter: true, focus: true, click: true }}
                  className='!bg-[#162036] !opacity-100 !rounded-sm !font-base !font-semibold'
                >
                  Network: {currency?.networkId === 1 ? 'ETH' : 'ARB'}
                </Tooltip>
              </>
            )}
          </div>
        </div>

        <div className='w-[2px] h-[60px] bg-card ml-10 mr-6' />
      </div>

      <div className='flex flex-col md:mb-auto'>
        <label className='font-title text-[.85rem] uppercase tracking-widest text-white/50'>Mode</label>

        <label className='font-title text-white text-[1rem]'>
          {isLoading || isEmpty(challengeMetrics) ? (
            <div className='animate-pulse h-[16px] bg-card rounded-md col-span-2 w-[50px] mt-2' />
          ) : (
            <>{isGroupChallenge ? 'Group' : '1 vs 1'}</>
          )}
        </label>
      </div>
    </Slider>
  )
}

export default ChallengeDetailSlider
