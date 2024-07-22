import { React, useState, useEffect } from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import './Draw.css'

const Draw = () => {
  const navigate = useNavigate()

  const createTeam = () => {
    navigate('/createTeam')
  }

  const id = localStorage.getItem('loggedUserID')

  const [draw, setDraw] = useState([])

  useEffect(() => {
    if (localStorage.getItem('loggedUserID') === null) navigate('/login')
    if (localStorage.getItem('selectedCountry') === null) navigate('/pickTeam')

    const fetchHandler = async () => {
      await fetch(`http://localhost:8080/draw/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setDraw(data.draw)
          localStorage.setItem('generatedDraw', JSON.stringify(data.draw))
        })
        .catch((err) => console.log(err))
    }

    fetchHandler()
  })

  const gameOver = () => {
    const patch = async () => {
      await fetch(`http://localhost:8080/game/${id}`, { method: 'PATCH' })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    }

    patch()
  }

  const goBackToStartNewGame = () => {
    navigate('/pickTeam')
    gameOver()
    localStorage.removeItem('gameLost')
    localStorage.removeItem('selectedCountry')
    localStorage.removeItem('generatedDraw')
    localStorage.removeItem('tournamentRound')
    localStorage.removeItem('team1')
    localStorage.removeItem('team2')
    localStorage.removeItem('infoSelectedPlayers')
    localStorage.removeItem('numberOfPositionMismatches')
    localStorage.removeItem('winners')
  }

  return (
    <div>
      {localStorage.getItem('gameLost') === null ? (
        <div>
          <br />
          <Button
            style={{ display: 'block', margin: 'auto' }}
            onClick={createTeam}
            type="submit"
            variant="contained"
            color="primary"
          >
            <h3>Create your team</h3>
          </Button>
          <br />
          <h1 style={{ textAlign: 'center' }}>
            You have selected the team {localStorage.getItem('selectedCountry')}
          </h1>
          <br />
        </div>
      ) : (
        ''
      )}

      {localStorage.getItem('gameLost') !== null ? (
        <div>
          <br></br>
          <Alert
            style={{ width: '600px', display: 'block', margin: 'auto' }}
            variant="filled"
            severity="warning"
          >
            Unfortunately, you lost the game. You can try again anytime.
          </Alert>
          <br></br>
          <Button
            style={{ display: 'block', margin: 'auto' }}
            onClick={goBackToStartNewGame}
            type="submit"
            variant="contained"
            color="primary"
          >
            <h3>Play again</h3>
          </Button>
          <br></br>
        </div>
      ) : (
        ''
      )}

      {localStorage.getItem('gameLost') === null &&
      localStorage.getItem('tournamentRound') === 'Final' ? (
        <div>
          <br></br>
          <Alert
            style={{ width: '600px', display: 'block', margin: 'auto' }}
            variant="filled"
            severity="info"
          >
            Congratulations! You won the game!
          </Alert>
          <br></br>
          <Button
            style={{ display: 'block', margin: 'auto' }}
            onClick={goBackToStartNewGame}
            type="submit"
            variant="contained"
            color="primary"
          >
            <h3>Play again</h3>
          </Button>
          <br></br>
        </div>
      ) : (
        ''
      )}

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h2 style={{ paddingLeft: '90px' }}>Round of 16</h2>
        <h2 style={{ paddingLeft: '130px' }}>Quarterfinals</h2>
        <h2 style={{ paddingLeft: '130px' }}>Semifinals</h2>
        <h2 style={{ paddingLeft: '180px' }}>Final</h2>
      </div>

      <div class="theme theme-dark">
        <div class="bracket disable-image">
          <div class="column one">
            {draw.map((item, key) =>
              item.DRAW_ROUND === 'Round of 16' &&
              item.DRAW_SCORE_COUNTRY_1 > item.DRAW_SCORE_COUNTRY_2 ? (
                <div class="match winner-top">
                  <div class="match-top team">
                    <span class="name">{item.DRAW_COUNTRY_1}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_1}</span>
                  </div>
                  <div class="match-bottom team">
                    <span class="name">{item.DRAW_COUNTRY_2}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_2}</span>
                  </div>
                  <div class="match-lines">
                    <div class="line one"></div>
                    <div class="line two"></div>
                  </div>
                  <div class="match-lines alt">
                    <div class="line one"></div>
                  </div>
                </div>
              ) : item.DRAW_ROUND === 'Round of 16' ? (
                <div class="match winner-bottom">
                  <div class="match-top team">
                    <span class="name">{item.DRAW_COUNTRY_1}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_1}</span>
                  </div>
                  <div class="match-bottom team">
                    <span class="name">{item.DRAW_COUNTRY_2}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_2}</span>
                  </div>
                  <div class="match-lines">
                    <div class="line one"></div>
                    <div class="line two"></div>
                  </div>
                  <div class="match-lines alt">
                    <div class="line one"></div>
                  </div>
                </div>
              ) : (
                ''
              ),
            )}
          </div>
          <div class="column two">
            {draw.map((item, key) =>
              item.DRAW_ROUND === 'Quarterfinals' &&
              item.DRAW_SCORE_COUNTRY_1 > item.DRAW_SCORE_COUNTRY_2 ? (
                <div class="match winner-top">
                  <div class="match-top team">
                    <span class="name">{item.DRAW_COUNTRY_1}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_1}</span>
                  </div>
                  <div class="match-bottom team">
                    <span class="name">{item.DRAW_COUNTRY_2}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_2}</span>
                  </div>
                  <div class="match-lines">
                    <div class="line one"></div>
                    <div class="line two"></div>
                  </div>
                  <div class="match-lines alt">
                    <div class="line one"></div>
                  </div>
                </div>
              ) : item.DRAW_ROUND === 'Quarterfinals' ? (
                <div class="match winner-bottom">
                  <div class="match-top team">
                    <span class="name">{item.DRAW_COUNTRY_1}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_1}</span>
                  </div>
                  <div class="match-bottom team">
                    <span class="name">{item.DRAW_COUNTRY_2}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_2}</span>
                  </div>
                  <div class="match-lines">
                    <div class="line one"></div>
                    <div class="line two"></div>
                  </div>
                  <div class="match-lines alt">
                    <div class="line one"></div>
                  </div>
                </div>
              ) : (
                ''
              ),
            )}
          </div>
          <div class="column three">
            {draw.map((item, key) =>
              item.DRAW_ROUND === 'Semifinals' &&
              item.DRAW_SCORE_COUNTRY_1 > item.DRAW_SCORE_COUNTRY_2 ? (
                <div class="match winner-top">
                  <div class="match-top team">
                    <span class="name">{item.DRAW_COUNTRY_1}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_1}</span>
                  </div>
                  <div class="match-bottom team">
                    <span class="name">{item.DRAW_COUNTRY_2}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_2}</span>
                  </div>
                  <div class="match-lines">
                    <div class="line one"></div>
                    <div class="line two"></div>
                  </div>
                  <div class="match-lines alt">
                    <div class="line one"></div>
                  </div>
                </div>
              ) : item.DRAW_ROUND === 'Semifinals' ? (
                <div class="match winner-bottom">
                  <div class="match-top team">
                    <span class="name">{item.DRAW_COUNTRY_1}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_1}</span>
                  </div>
                  <div class="match-bottom team">
                    <span class="name">{item.DRAW_COUNTRY_2}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_2}</span>
                  </div>
                  <div class="match-lines">
                    <div class="line one"></div>
                    <div class="line two"></div>
                  </div>
                  <div class="match-lines alt">
                    <div class="line one"></div>
                  </div>
                </div>
              ) : (
                ''
              ),
            )}
          </div>
          <div class="column four">
            {draw.map((item, key) =>
              item.DRAW_ROUND === 'Final' &&
              item.DRAW_SCORE_COUNTRY_1 > item.DRAW_SCORE_COUNTRY_2 ? (
                <div class="match winner-top">
                  <div class="match-top team">
                    <span class="name">{item.DRAW_COUNTRY_1}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_1}</span>
                  </div>
                  <div class="match-bottom team">
                    <span class="name">{item.DRAW_COUNTRY_2}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_2}</span>
                  </div>
                  <div class="match-lines">
                    <div class="line one"></div>
                    <div class="line two"></div>
                  </div>
                  <div class="match-lines alt">
                    <div class="line one"></div>
                  </div>
                </div>
              ) : item.DRAW_ROUND === 'Final' ? (
                <div class="match winner-bottom">
                  <div class="match-top team">
                    <span class="name">{item.DRAW_COUNTRY_1}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_1}</span>
                  </div>
                  <div class="match-bottom team">
                    <span class="name">{item.DRAW_COUNTRY_2}</span>
                    <span class="score">{item.DRAW_SCORE_COUNTRY_2}</span>
                  </div>
                  <div class="match-lines">
                    <div class="line one"></div>
                    <div class="line two"></div>
                  </div>
                  <div class="match-lines alt">
                    <div class="line one"></div>
                  </div>
                </div>
              ) : (
                ''
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Draw
