import { React, useEffect } from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './PickTeam.css'

const PickTeam = () => {
  const navigate = useNavigate()

  const id = localStorage.getItem('loggedUserID')

  useEffect(() => {
    const getActiveDraw = async () => {
      await fetch(`http://localhost:8080/draw/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.draw.length > 0) {
            localStorage.setItem('generatedDraw', JSON.stringify(data.draw))
            localStorage.setItem(
              'selectedCountry',
              data.draw[0].GAME_SELECTED_COUNTRY,
            )
            navigate('/draw')
          }
        })
        .catch((err) => console.log(err))
    }

    getActiveDraw()

    if (localStorage.getItem('selectedCountry') !== null) navigate('/draw')
    if (localStorage.getItem('loggedUserID') === null) navigate('/login')
    if (localStorage.getItem('gameLost') === true) navigate('/draw')
  })

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const COUNTRIES = [
    {
      country: 'Spain',
      flag: 'https://upload.wikimedia.org/wikipedia/en/9/9a/Flag_of_Spain.svg',
    },
    {
      country: 'Georgia',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Flag_of_Georgia.svg/2560px-Flag_of_Georgia.svg.png',
    },
    {
      country: 'Germany',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg',
    },
    {
      country: 'Denmark',
      flag:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJrB2tvJWILmMzIC76HwWYGsNApWBl1YUwjQ&s',
    },
    {
      country: 'Portugal',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/600px-Flag_of_Portugal.svg.png',
    },
    {
      country: 'Slovenia',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/f/f0/Flag_of_Slovenia.svg',
    },
    {
      country: 'France',
      flag:
        'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/255px-Flag_of_France.svg.png',
    },
    {
      country: 'Belgium',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Flag_of_Belgium.svg/1200px-Flag_of_Belgium.svg.png',
    },
    {
      country: 'Romania',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/7/73/Flag_of_Romania.svg',
    },
    {
      country: 'Netherlands',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg',
    },
    {
      country: 'Austria',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_Austria.svg',
    },
    {
      country: 'Turkey',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Flag_of_Turkey.svg/1024px-Flag_of_Turkey.svg.png',
    },
    {
      country: 'England',
      flag:
        'https://upload.wikimedia.org/wikipedia/en/thumb/b/be/Flag_of_England.svg/2560px-Flag_of_England.svg.png',
    },
    {
      country: 'Slovakia',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Flag_of_Slovakia.svg/1024px-Flag_of_Slovakia.svg.png',
    },
    {
      country: 'Switzerland',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Flag_of_Switzerland.svg/1200px-Flag_of_Switzerland.svg.png',
    },
    {
      country: 'Italy',
      flag:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/1024px-Flag_of_Italy.svg.png',
    },
  ]

  const selectTeam = (e) => {
    const initialDraw = []
    navigate('/draw')
    localStorage.setItem('selectedCountry', e.target.innerText)
    for (let i = 0; i < COUNTRIES.length; i++) {
      initialDraw.push(COUNTRIES[i].country)
    }
    const shuffleDraw = shuffle(initialDraw)

    const createGame = async () => {
      await fetch('http://localhost:8080/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          GAME_USER_ID: localStorage.getItem('loggedUserID'),
          GAME_SELECTED_COUNTRY: localStorage.getItem('selectedCountry'),
        }),
      })
        .then((res) => res.json())
        .then((data) => localStorage.setItem('gameID', data.GAME_ID))
        .catch((err) => console.log(err))

      for (let i = 0; i < shuffleDraw.length / 2; i++) {
        await fetch('http://localhost:8080/draw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            DRAW_GAME_ID: localStorage.getItem('gameID'),
            DRAW_ROUND: 'Round of 16',
            DRAW_COUNTRY_1: shuffleDraw[i * 2],
            DRAW_COUNTRY_2: shuffleDraw[i * 2 + 1],
          }),
        })
          .then((res) => res.json())
          .catch((err) => console.log(err))
      }
    }

    createGame()
  }

  return (
    <div className="main">
      <h1 style={{ paddingLeft: '60px' }}>Choose your team</h1>
      <br />
      <ul>
        {COUNTRIES.map((team, key) => (
          <li key={key}>
            <div className="main">
              <div className="card">
                <img src={team.flag} alt="country flag" />
                <br />
                <h4>
                  <Button
                    onClick={selectTeam}
                    type="submit"
                    variant="contained"
                  >
                    {team.country}
                  </Button>
                </h4>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PickTeam
