import React from 'react'
import PropTypes from 'prop-types'
import { fetchMainPosts } from '../utils/api'
import Loading from './Loading'
import PostsList from './PostsList'

function postsReducer(state, action) {
  if (action.type === 'fetch') {
    return {
      posts: null,
      error: null,
      loading: true
    }
  } else if (action.type === 'success') {
    return {
      posts: action.posts,
      error: null,
      loading: false
    }
  } else if (action.type === 'error') {
    return {
      posts: state.posts,
      error: action.error.message,
      loading: false
    }
  } else {
    throw new Error(`This action type isn't supported.`)
  }
}

export default function Posts ({ type }) {
  const [state, dispatch] = React.useReducer(
    postsReducer,
    { posts: null, error: null, loading: true }
  )

  React.useEffect(() => {
    dispatch({ type: 'fetch' })

    fetchMainPosts(type)
      .then(posts => dispatch({ type: 'success', posts }))
      .catch(error => dipatch({ type: 'error', error }))
  }, [type])

  if (state.loading === true) {
    return <Loading />
  }

  if (state.error) {
    return <p className='center-text error'>{state.error}</p>
  }

  return <PostsList posts={state.posts} />
}

Posts.propTypes = {
  type: PropTypes.oneOf(['top', 'new'])
}