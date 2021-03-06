import React from 'react'
import { Store } from './Store'

const EpisodesList = React.lazy(() => import('./EpisodesList'))

export default function HomePage() {
    const { state, dispatch } = React.useContext(Store)

    const fetchDataAction = async () => {
        const data = await fetch('https://api.tvmaze.com/singlesearch/shows?q=rick-&-morty&embed=episodes')
        const dataJSON = await data.json()
        return dispatch({
            type: 'FETCH_DATA',
            payload: dataJSON._embedded.episodes
        })
    }
    
    const toggleFavAction = episode => {
        const episodeInFavourites = state.favourites.includes(episode)
        let dispatchObj = {
            type: 'ADD_FAV',
            payload: episode
        }
        if (episodeInFavourites) {
            const favouritesWithoutEpisode = state.favourites.filter(fav => fav.id !== episode.id) //I would've done the filtering in the reducer
            dispatchObj = {
                type: 'REMOVE_FAV',
                payload: favouritesWithoutEpisode
            }
        }
        return dispatch(dispatchObj)
    }

    React.useEffect(() => {
        state.episodes.length === 0 && fetchDataAction()
    })

    const props = {
        episodes: state.episodes,
        toggleFavAction: toggleFavAction,
        favourites: state.favourites
    }

    return (
        <React.Fragment>
            <React.Suspense fallback={<div>Loading...</div>}>
                <section className='episode-layout'>
                    <EpisodesList {...props} />
                </section>
            </React.Suspense>
        </React.Fragment>
    )
}
