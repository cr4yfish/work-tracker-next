import Head from 'next/head';
import { useStopwatch } from 'react-timer-hook';
import { Container, Button, Table, Grid, Text } from "@nextui-org/react";
import useSWR, { mutate, useSWRConfig} from 'swr';

import { FaPlay, FaStop, FaStopCircle } from 'react-icons/fa';

const fetcher = (...args) => fetch(...args).then(res => res.json())

// returns normalized timestrings -> 0h 0min 0sec
function cleanTimeString(str) {
  var date = new Date(str);
  let hours = date.getHours() * 3600000;
  let minutes = date.getMinutes() * 60000;
  let seconds = date.getSeconds() * 1000;
  str = str - (hours+minutes+seconds) + 1000;
  return str;
}

function MyStopwatch() {

  const {
    seconds,
    minutes,
    hours,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });

  const stop = async () => {
    pause();
    const date = cleanTimeString(Date.now());
    const timeInSeconds = seconds + minutes * 60 + hours * 3600;
    const obj = { date: date, timeInSeconds: timeInSeconds };
    const options = { method: "POST", body: JSON.stringify(obj) };
    const databaseRes = await fetch(`api/send`, options);

    // update swr data
    mutate("/api/get");

    return databaseRes;
  }

  const checkNum10 = (num) => {  return num < 10 ? "0" + num : num; }

  return (
    <div>
      <h1>Work Tracker</h1>
      <Container>
      <Grid.Container>
        <Text h2>{checkNum10(hours)}</Text>
        <Text h2>:</Text>
        <Text h2>{checkNum10(minutes)}</Text>
        <Text h2>:</Text>
        <Text h2>{checkNum10(seconds)}</Text>
      </Grid.Container>
      
        <Grid.Container gap={2}>
          <Grid>
            {isRunning ? <Container><Button shadow iconRight={<FaStop />} color="secondary" onClick={stop}>Pause</Button></Container> : <Container><Button shadow iconRight={<FaPlay />} onClick={start}>Start</Button></Container>}
          </Grid>
          <Grid>
            <Container><Button color="error" bordered onClick={() => {reset()}} fill="currentColor" iconRight={<FaStopCircle  />} >Reset</Button></Container>
          </Grid>
        </Grid.Container>
      </Container>

    </div>
  );
}

const add0 = (time) => {
  return time < 10 ? "0" + time : time;
}

// take in time as seconds and return as hh:mm:ss
function convertSecondsToTimeString(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let secondsLeft = seconds % 60;
  return `${add0(hours)}:${add0(minutes)}:${add0(secondsLeft)}`;
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// take in ms time and return as DD.MM.YYYYY
const formatTime = (date) => {
  let todayDate = cleanTimeString(new Date().getTime());

  // Figure out if date lies in current week
  const weekStart = todayDate - (todayDate % (1000 * 60 * 60 * 24 * 7));
  const weekEnd = weekStart + (1000 * 60 * 60 * 24 * 7);
  const isInWeek = date >= weekStart && date <= weekEnd;

  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const todayDateObj = new Date(todayDate);

  if(todayDateObj.getFullYear() == year && todayDateObj.getMonth()+1 == month && todayDateObj.getDate() == day) {
    return `Today, ${day}.${month}.${year}`
  };

  if(isInWeek) { return `Last ${days[date.getDay()]}, ${day}.${month}.${year}` }
  return `${day < 10 ? "0" + day : day}.${month < 10 ? "0" + day : day}.${year}`;

}

const columns = [
  { key: "date", label: "Date"},
  { key: "timeInSeconds", label: "Time"},
]

const renderCell = (item, key) => {
  const cellValue = item[key];
  switch(key) {
    case "timeInSeconds":
      return convertSecondsToTimeString(cellValue);
    default:
      return formatTime(cellValue);
  }
}

function TableRender() {
  const { data, error } = useSWR('/api/get', fetcher);

  if(error) return <div>failed to load</div>;
  if(!data) return <div>loading...</div>;


  return (
    <Table aria-label="Table of entries" selectionMode='single' selectionBehavior='replace' >
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.key} >{column.label}</Table.Column>
        )}
      </Table.Header>
      <Table.Body items={data}>
        {(item) => (
          <Table.Row key={item._id}>
            {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}

export default function Home() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 600);

  return (
    <div>
      <Head>
        <title>Work Tracker</title>
        <meta name="description" content="Track time maybe even work" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <MyStopwatch />
        <TableRender />
      </Container>
    </div>
  )
}
