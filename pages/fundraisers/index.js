import React, { Fragment, useEffect, useState } from 'react'
import { readString } from 'react-papaparse'
import { client, loginParams, csvParams } from '../../lib/api'
import { stringify } from 'qs'
import Head from 'next/head'
import Leaderboard from '../../components/Leaderboard'
import Page from '../../components/Page'

const Fundraisers = ({ fundraisers, ...props }) => {
  const [individuals, setIndividuals] = useState([])
  const [status, setStatus] = useState('fetching')
  useEffect(() => {
    Promise.resolve()
      .then(() => readString(fundraisers,
        { header: true }))
      .then(({ data }) => setIndividuals(data))
      .then(() => setStatus('fetched'))
      .catch(error => {
        console.error(error)
        setStatus('failed')
      })
  }, [])

  return (
    <Fragment>
      <Head>
        <title>ALSAC Heroes Fundraiser Leaderboard</title>
      </Head>
      <Page status={status} {...props}>
        {status === 'fetched' && (
          <Leaderboard
            data={individuals}
            type='participant'
            {...props}
          />
        )}
      </Page>
    </Fragment>
  )
}

Fundraisers.getInitialProps = async (ctx) => {
  let login = await client({
    url: '/SRConsAPI',
    data: stringify(loginParams())
  })

  let token = await login.data.loginResponse.token

  let fundraisersResponse = await client({
    url: '/SRContentAPI',
    data: stringify(csvParams('participants'))
  })

  let fundraisers = await fundraisersResponse.data.getTagInfoResponse.preview

  return { fundraisers, token }
}

export default Fundraisers
