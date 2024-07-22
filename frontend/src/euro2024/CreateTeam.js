import { React, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'

import { Button } from '@mui/material'
import Alert from '@mui/material/Alert'

const CreateTeam = () => {
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    }
  }

  const theme = useTheme()

  const [players, setPlayers] = useState([])
  const [selectedPlayers, setSelectedPlayers] = useState([])

  const [goalkeepers, setGoalkeepers] = useState([])
  const [defenders, setDefenders] = useState([])
  const [midfielders, setMidfielders] = useState([])
  const [attackers, setAttackers] = useState([])
  const [inputError, setInputError] = useState('')
  const navigate = useNavigate()

  const loggedUser = localStorage.getItem('loggedUserID')

  useEffect(() => {
    setSelectedPlayers([
      ...goalkeepers,
      ...defenders,
      ...midfielders,
      ...attackers,
    ])
  }, [goalkeepers, defenders, midfielders, attackers])

  useEffect(() => {
    if (localStorage.getItem('loggedUserID') === null) navigate('/login')
    if (localStorage.getItem('gameLost') === true) navigate('/draw')
    if (
      JSON.parse(localStorage.getItem('generatedDraw'))[
        JSON.parse(localStorage.getItem('generatedDraw')).length - 1
      ].DRAW_ROUND === 'Final'
    )
      localStorage.setItem('tournamentRound', 'Final')
    if (
      JSON.parse(localStorage.getItem('generatedDraw'))[
        JSON.parse(localStorage.getItem('generatedDraw')).length - 1
      ].DRAW_ROUND === 'Semifinals'
    )
      localStorage.setItem('tournamentRound', 'Semifinals')
    if (
      JSON.parse(localStorage.getItem('generatedDraw'))[
        JSON.parse(localStorage.getItem('generatedDraw')).length - 1
      ].DRAW_ROUND === 'Quarterfinals'
    )
      localStorage.setItem('tournamentRound', 'Quarterfinals')
    if (
      JSON.parse(localStorage.getItem('generatedDraw'))[
        JSON.parse(localStorage.getItem('generatedDraw')).length - 1
      ].DRAW_ROUND === 'Round of 16'
    )
      localStorage.setItem('tournamentRound', 'Round of 16')
  }, [])

  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event
    setGoalkeepers(typeof value === 'string' ? value.split(',') : value)
  }

  const handleChange2 = (event) => {
    const {
      target: { value },
    } = event
    setDefenders(typeof value === 'string' ? value.split(',') : value)
  }

  const handleChange3 = (event) => {
    const {
      target: { value },
    } = event
    setMidfielders(typeof value === 'string' ? value.split(',') : value)
  }

  const handleChange4 = (event) => {
    const {
      target: { value },
    } = event
    setAttackers(typeof value === 'string' ? value.split(',') : value)
  }

  const playRound = () => {
    let inputValid = true
    var winners = []

    if (
      goalkeepers.length !== 1 ||
      defenders.length !== 4 ||
      midfielders.length !== 4 ||
      attackers.length !== 2
    ) {
      inputValid = false
      setInputError(
        'Please check if you had chosen the specified number of players for each category',
      )
    } else setInputError('')

    if (inputValid) {
      recreateInfoSelectedTeam()

      for (
        let i = 0;
        i < JSON.parse(localStorage.getItem('generatedDraw')).length;
        i++
      ) {
        if (
          JSON.parse(localStorage.getItem('generatedDraw'))[i].DRAW_ROUND ===
          localStorage.getItem('tournamentRound')
        ) {
          computeScore(JSON.parse(localStorage.getItem('generatedDraw'))[i])
          if (
            i ===
            JSON.parse(localStorage.getItem('generatedDraw')).length - 1
          )
            getUpdatedDraw()
        }
      }

      for (
        let i = 0;
        i < JSON.parse(localStorage.getItem('generatedDraw')).length;
        i++
      ) {
        if (
          JSON.parse(localStorage.getItem('generatedDraw'))[i].DRAW_ROUND ===
          localStorage.getItem('tournamentRound')
        ) {
          if (
            JSON.parse(localStorage.getItem('generatedDraw'))[i]
              .DRAW_SCORE_COUNTRY_1 >
            JSON.parse(localStorage.getItem('generatedDraw'))[i]
              .DRAW_SCORE_COUNTRY_2
          )
            winners.push(
              JSON.parse(localStorage.getItem('generatedDraw'))[i]
                .DRAW_COUNTRY_1,
            )
          else
            winners.push(
              JSON.parse(localStorage.getItem('generatedDraw'))[i]
                .DRAW_COUNTRY_2,
            )
        }
      }

      localStorage.setItem('winners', winners)
      if (
        !winners.includes(
          localStorage.getItem('selectedCountry').charAt(0).toUpperCase() +
            localStorage.getItem('selectedCountry').slice(1).toLowerCase(),
        )
      ) {
        localStorage.setItem('gameLost', true)
      } else if (winners.length >= 2) {
        for (let i = 0; i < winners.length / 2; i++) {
          insertWinners(winners[2 * i], winners[2 * i + 1])
        }
      }
      navigate('/draw')
    }
  }

  const recreateInfoSelectedTeam = () => {
    var arr = []
    var count = 0
    for (let i = 0; i < selectedPlayers.length; i++) {
      for (let j = 0; j < players.length; j++) {
        if (selectedPlayers[i] === players[j].PLAYER_NAME) {
          arr.push(players[j])
          if (i === 0 && players[j].PLAYER_POSITION !== 'Goalkeeper') count++
          if (i >= 1 && i <= 4 && players[j].PLAYER_POSITION !== 'Defender')
            count++
          if (i >= 5 && i <= 8 && players[j].PLAYER_POSITION !== 'Midfielder')
            count++
          if (i >= 9 && i <= 10 && players[j].PLAYER_POSITION !== 'Attacker')
            count++
        }
      }
    }

    localStorage.setItem('infoSelectedPlayers', JSON.stringify(arr))
    localStorage.setItem('numberOfPositionMismatches', count)
  }

  const getUpdatedDraw = () => {
    const fetchHandler = async () => {
      await fetch(`http://localhost:8080/draw/${loggedUser}`)
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('generatedDraw', JSON.stringify(data.draw))
        })
        .catch((err) => console.log(err))
    }
    fetchHandler()
  }

  const shuffle = (array) => {
    for (let i = array?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  const computeScore = (match) => {
    var score1 = 0
    var score2 = 0
    if (
      match.DRAW_COUNTRY_1 ===
      localStorage.getItem('selectedCountry').charAt(0).toUpperCase() +
        localStorage.getItem('selectedCountry').slice(1).toLowerCase()
    ) {
      localStorage.setItem('team1', localStorage.getItem('infoSelectedPlayers'))
      fetchTeam(match.DRAW_COUNTRY_2, 1)
    } else if (
      match.DRAW_COUNTRY_2 ===
      localStorage.getItem('selectedCountry').charAt(0).toUpperCase() +
        localStorage.getItem('selectedCountry').slice(1).toLowerCase()
    ) {
      fetchTeam(match.DRAW_COUNTRY_1, 0)
      localStorage.setItem('team2', localStorage.getItem('infoSelectedPlayers'))
    } else {
      fetchTeam(match.DRAW_COUNTRY_1, 0)
      fetchTeam(match.DRAW_COUNTRY_2, 1)
    }

    truncateTeam()

    for (let i = 0; i < JSON.parse(localStorage.getItem('team1')).length; i++) {
      score1 +=
        (JSON.parse(localStorage.getItem('team1'))[i].PLAYER_DEFENSE +
          JSON.parse(localStorage.getItem('team1'))[i].PLAYER_PASSING +
          JSON.parse(localStorage.getItem('team1'))[i].PLAYER_SHOOTING) /
        3
    }
    for (let i = 0; i < JSON.parse(localStorage.getItem('team2')).length; i++) {
      score2 +=
        (JSON.parse(localStorage.getItem('team2'))[i].PLAYER_DEFENSE +
          JSON.parse(localStorage.getItem('team2'))[i].PLAYER_PASSING +
          JSON.parse(localStorage.getItem('team2'))[i].PLAYER_SHOOTING) /
        3
    }

    if (
      JSON.parse(localStorage.getItem('team1'))[0]?.PLAYER_COUNTRY ===
      localStorage.getItem('selectedCountry').charAt(0).toUpperCase() +
        localStorage.getItem('selectedCountry').slice(1).toLowerCase()
    ) {
      score1 =
        (1 -
          localStorage.getItem('numberOfPositionMismatches') /
            (localStorage.getItem('numberOfPositionMismatches') + 1)) *
        score1
    }

    if (
      JSON.parse(localStorage.getItem('team2'))[0]?.PLAYER_COUNTRY ===
      localStorage.getItem('selectedCountry').charAt(0).toUpperCase() +
        localStorage.getItem('selectedCountry').slice(1).toLowerCase()
    ) {
      score2 =
        (1 -
          localStorage.getItem('numberOfPositionMismatches') /
            (localStorage.getItem('numberOfPositionMismatches') + 1)) *
        score2
    }

    if (score1 > score2) {
      if (score2 !== 0) {
        score1 = Math.ceil(score1 / score2)
        if (score1 > 1.5 * score2) score2 = 0
        else score2 = 1
      } else {
        score1 = 2
        score2 = 0
      }
    } else if (score2 > score1) {
      if (score1 !== 0) {
        score2 = Math.ceil(score2 / score1)
        if (score2 > 1.5 * score1) score1 = 0
        else score1 = 1
      } else {
        score2 = 2
        score1 = 0
      }
    } else {
      score1 = Math.random() * 5
      score2 = Math.random() * 5
      if (score1 > score2) {
        score1 = Math.ceil(score1)
        score2 = Math.floor(score2)
      } else {
        score1 = Math.floor(score1)
        score2 = Math.ceil(score2)
      }
    }

    updateScore(match, score1, score2)
  }

  const updateScore = (match, score1, score2) => {
    const patch = async () => {
      await fetch(`http://localhost:8080/draw/${match.DRAW_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          DRAW_SCORE_COUNTRY_1: score1,
          DRAW_SCORE_COUNTRY_2: score2,
        }),
      })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    }

    patch()
  }

  const insertWinners = (country1, country2) => {
    const insert = async () => {
      await fetch(`http://localhost:8080/draw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          DRAW_GAME_ID: JSON.parse(localStorage.getItem('generatedDraw'))[0]
            .DRAW_GAME_ID,
          DRAW_ROUND:
            localStorage.getItem('tournamentRound') === 'Round of 16'
              ? 'Quarterfinals'
              : localStorage.getItem('tournamentRound') === 'Quarterfinals'
              ? 'Semifinals'
              : localStorage.getItem('tournamentRound') === 'Semifinals'
              ? 'Final'
              : '',
          DRAW_ROUND_POSITION: 2,
          DRAW_COUNTRY_1: country1,
          DRAW_COUNTRY_2: country2,
        }),
      })
        .then((res) => res.json())
        .catch((err) => console.log(err))
    }

    insert()
  }

  const truncateTeam = () => {
    shuffle(JSON.parse(localStorage.getItem('team1')))
    shuffle(JSON.parse(localStorage.getItem('team2')))
    const randomTeam1 = JSON.parse(localStorage.getItem('team1'))
    const randomTeam2 = JSON.parse(localStorage.getItem('team2'))

    var arrayPlayersTeam1 = []
    var arrayPlayersTeam2 = []
    var countGoalkeeper1 = 0
    var countDefender1 = 0
    var countMidfielder1 = 0
    var countAttacker1 = 0
    var countGoalkeeper2 = 0
    var countDefender2 = 0
    var countMidfielder2 = 0
    var countAttacker2 = 0

    for (let i = 0; i < randomTeam1?.length; i++) {
      if (
        randomTeam1[i].PLAYER_POSITION === 'Goalkeeper' &&
        countGoalkeeper1 < 1
      ) {
        arrayPlayersTeam1.push(randomTeam1[i])
        countGoalkeeper1++
      }
      if (randomTeam1[i].PLAYER_POSITION === 'Defender' && countDefender1 < 4) {
        arrayPlayersTeam1.push(randomTeam1[i])
        countDefender1++
      }
      if (
        randomTeam1[i].PLAYER_POSITION === 'Midfielder' &&
        countMidfielder1 < 4
      ) {
        arrayPlayersTeam1.push(randomTeam1[i])
        countMidfielder1++
      }
      if (randomTeam1[i].PLAYER_POSITION === 'Attacker' && countAttacker1 < 2) {
        arrayPlayersTeam1.push(randomTeam1[i])
        countAttacker1++
      }
    }

    for (let i = 0; i < randomTeam2?.length; i++) {
      if (
        randomTeam2[i].PLAYER_POSITION === 'Goalkeeper' &&
        countGoalkeeper2 < 1
      ) {
        arrayPlayersTeam2.push(randomTeam2[i])
        countGoalkeeper2++
      }
      if (randomTeam2[i].PLAYER_POSITION === 'Defender' && countDefender2 < 4) {
        arrayPlayersTeam2.push(randomTeam2[i])
        countDefender2++
      }
      if (
        randomTeam2[i].PLAYER_POSITION === 'Midfielder' &&
        countMidfielder2 < 4
      ) {
        arrayPlayersTeam2.push(randomTeam2[i])
        countMidfielder2++
      }
      if (randomTeam2[i].PLAYER_POSITION === 'Attacker' && countAttacker2 < 2) {
        arrayPlayersTeam2.push(randomTeam2[i])
        countAttacker2++
      }
    }

    localStorage.setItem('team1', JSON.stringify(arrayPlayersTeam1))
    localStorage.setItem('team2', JSON.stringify(arrayPlayersTeam2))
  }

  const fetchTeam = (countryTeam, index) => {
    const fetchPlayers = async () => {
      await fetch(`http://localhost:8080/player/${countryTeam}`)
        .then((res) => res.json())
        .then((data) => {
          if (index === 0)
            localStorage.setItem('team1', JSON.stringify(data.players))
          else localStorage.setItem('team2', JSON.stringify(data.players))
        })
        .catch((err) => console.log(err))
    }

    fetchPlayers()
  }

  const country =
    localStorage.getItem('selectedCountry').charAt(0).toUpperCase() +
    localStorage.getItem('selectedCountry').slice(1).toLowerCase()

  useEffect(() => {
    const fetchPlayerForSelectedCountry = async () => {
      await fetch(`http://localhost:8080/player/${country}`)
        .then((res) => res.json())
        .then((data) => {
          setPlayers(data.players)
        })
        .catch((err) => console.log(err))
    }
    fetchPlayerForSelectedCountry()
  }, [])

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>
        Choose the players for the team{' '}
        {localStorage.getItem('selectedCountry')}
      </h1>
      <br />
      <Button
        style={{ display: 'block', margin: 'auto' }}
        onClick={playRound}
        variant="contained"
        color="primary"
      >
        <h4>Play the match</h4>
      </Button>

      {inputError !== '' ? (
        <div>
          <br></br>
          <Alert
            style={{ width: '600px', display: 'block', margin: 'auto' }}
            variant="filled"
            severity="warning"
          >
            {inputError}
          </Alert>
        </div>
      ) : (
        ''
      )}
      <br />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <TableContainer
          className="table"
          sx={{ maxHeight: 350, maxWidth: 550 }}
        >
          <Table stickyHeader aria-label="players table">
            <TableHead>
              <TableRow>
                <TableCell>Player Name</TableCell>
                <TableCell align="right">Position</TableCell>
                <TableCell align="right">Defense Score</TableCell>
                <TableCell align="right">Passing Score</TableCell>
                <TableCell align="right">Shooting Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.PLAYERID}>
                  <TableCell>{player.PLAYER_NAME}</TableCell>
                  <TableCell align="right">{player.PLAYER_POSITION}</TableCell>
                  <TableCell align="right">{player.PLAYER_DEFENSE}</TableCell>
                  <TableCell align="right">{player.PLAYER_PASSING}</TableCell>
                  <TableCell align="right">{player.PLAYER_SHOOTING}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <h4 style={{ paddingLeft: '10px' }}>Choose 1 Goalkeeper</h4>
            <Button
              style={{ textDecoration: 'none', color: 'blue' }}
              onClick={() => setGoalkeepers([])}
            >
              Reset
            </Button>
          </div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={goalkeepers}
              onChange={handleChange1}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {players.map((player) => (
                <MenuItem
                  key={player.PLAYER_ID}
                  value={player.PLAYER_NAME}
                  style={getStyles(player, goalkeepers, theme)}
                  disabled={selectedPlayers.includes(player.PLAYER_NAME)}
                >
                  {player.PLAYER_NAME}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <h4 style={{ paddingLeft: '10px' }}>Choose 4 Defenders</h4>
            <Button
              style={{ textDecoration: 'none', color: 'blue' }}
              onClick={() => setDefenders([])}
            >
              Reset
            </Button>
          </div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={defenders}
              onChange={handleChange2}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {players.map((player) => (
                <MenuItem
                  key={player.PLAYER_ID}
                  value={player.PLAYER_NAME}
                  style={getStyles(player, defenders, theme)}
                  disabled={selectedPlayers.includes(player.PLAYER_NAME)}
                >
                  {player.PLAYER_NAME}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <h4 style={{ paddingLeft: '10px' }}>Choose 4 Midfielders</h4>
            <Button
              style={{ textDecoration: 'none', color: 'blue' }}
              onClick={() => setMidfielders([])}
            >
              Reset
            </Button>
          </div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={midfielders}
              onChange={handleChange3}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {players.map((player) => (
                <MenuItem
                  key={player.PLAYER_ID}
                  value={player.PLAYER_NAME}
                  style={getStyles(player, midfielders, theme)}
                  disabled={selectedPlayers.includes(player.PLAYER_NAME)}
                >
                  {player.PLAYER_NAME}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <h4 style={{ paddingLeft: '10px' }}>Choose 2 Attackers</h4>
            <Button
              style={{ textDecoration: 'none', color: 'blue' }}
              onClick={() => setAttackers([])}
            >
              Reset
            </Button>
          </div>

          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={attackers}
              onChange={handleChange4}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {players.map((player) => (
                <MenuItem
                  key={player.PLAYER_ID}
                  value={player.PLAYER_NAME}
                  style={getStyles(player, attackers, theme)}
                  disabled={selectedPlayers.includes(player.PLAYER_NAME)}
                >
                  {player.PLAYER_NAME}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  )
}

export default CreateTeam
