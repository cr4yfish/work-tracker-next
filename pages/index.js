import Head from 'next/head';
import { useStopwatch } from 'react-timer-hook';
import { Container, Button, Spacer, Table, useAsyncList, useCollator } from "@nextui-org/react";
import useSWR from 'swr';
import { useEffect, useState } from "react"

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
    return databaseRes;
  }

  const checkNum10 = (num) => {  return num < 10 ? "0" + num : num; }

  return (
    <div>
      <h1>Work Tracker</h1>
      <div>
        <span>{checkNum10(hours)}</span>:<span>{checkNum10(minutes)}</span>:<span>{checkNum10(seconds)}</span>
      </div>
      <p>{isRunning ? 'Running' : 'Not running'}</p>
      {isRunning ? <Button color="secondary" onClick={stop}>Pause</Button> :<Button onClick={start}>Start</Button> }
      <Spacer />
      <Button color="warn" bordered onClick={reset}>Reset</Button>
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
  const todayDate = cleanTimeString(new Date().getTime());

  // Figure out if date lies in current week
  const weekStart = todayDate - (todayDate % (1000 * 60 * 60 * 24 * 7));
  const weekEnd = weekStart + (1000 * 60 * 60 * 24 * 7);
  const isInWeek = date >= weekStart && date <= weekEnd;

  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if(isInWeek) {
    return `Last ${days[date.getDay()]}, ${day}.${month}.${year}`;
  }
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
