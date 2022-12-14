import { useEffect, useState } from "react";
import "./EventList.css";
import { Event } from "./Event";
import { useNavigate } from "react-router-dom";

export const EventList = ({ }) => {
  const [events, setEvents] = useState([]);
  const [sortArray, setSortArray] = useState([])
  const [sortDate, setSortDate] = useState(false);
  const [sortFavorited, setSortFavorited] = useState(false);
  const [sortComments, setSortComments] = useState(false);
  const [events2, setEvents2] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [dropDown, setDropDown] = useState(0);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigate = useNavigate();
  const localCheekwoodUser = localStorage.getItem("project_user");
  const cheekwoodUserObject = JSON.parse(localCheekwoodUser);


  useEffect(() => {
    const eventTypesFetch = async () => {
      const response = await fetch(`http://localhost:8088/eventTypes`);
      const eventData = await response.json();
      setEventTypes(eventData);
    };
    eventTypesFetch();
  }, []);

  const fetchEvents = async () => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8088/events?_embed=patronSavedEvents&_expand=eventType&_embed=patronComments`
      );
      const data = await response.json();
      setEvents(data);
    };
    fetchData();
  }

  const fetchEvents2 = async () => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8088/events?_embed=patronSavedEvents&_expand=eventType`
      );
      const data = await response.json();
      setEvents2(data);
    };
    fetchData();
  }

  const fetchAll = async () => {
    await fetchEvents()
    await fetchEvents2()
  }

  useEffect(() => {
    fetchAll()
  }, []);

  const fetchSortedCall = async () => {
    const fetchData = await fetch(`http://localhost:8088/events?_embed=patronSavedEvents&_expand=eventType&_sort=startDate&_order=desc`)
    const fetchJson = await fetchData.json()
    setSortFavorited(false)
    setSortComments(false)
    setFilteredEvents(fetchJson)
  }


  useEffect(() => {
    sortDate ? fetchSortedCall() : setFilteredEvents(events)

  }, [sortDate]
  )



  const sortFavorites = () => {
    if (events.length > 0 && events[0].name !== undefined) {
      const copy = events.map(x => ({ ...x }))
      if (sortFavorited) {
        copy.sort((a, b) => b.patronSavedEvents.length - a.patronSavedEvents.length)
        setFilteredEvents(copy)
      } else {
        copy.sort((a, b) => a.patronSavedEvents.length - b.patronSavedEvents.length)
        setFilteredEvents(copy)
      }
    }
  }
  const sortComment = () => {
    if (events.length > 0 && events[0].name !== undefined) {
      const copy = events.map(x => ({ ...x }))
      console.log(copy.sort((a, b) => b.patronComments.length - a.patronComments.length))
      if (sortComments) {
        copy.sort((a, b) => b.patronComments.length - a.patronComments.length)
        setFilteredEvents(copy)
      } else {
        copy.sort((a, b) => a.patronComments.length - b.patronComments.length)
        setFilteredEvents(copy)
      }
    }
  }


  useEffect(() => {
    setSortComments(false)
    setSortDate(false)
    sortFavorites()

  }, [sortFavorited])


  useEffect(() => {
    setSortFavorited(false)
    setSortDate(false)
    sortComment()

  }, [sortComments])





  useEffect(() => {
    if (dropDown > 0) {
      const selectEvent = events.filter(
        (event) => event.eventType.id === dropDown
      );
      setFilteredEvents(selectEvent);
    } else {
      setFilteredEvents(events);
    }
  }, [dropDown, events]);


  return <>
    {events.length > 0 && events[0].name !== undefined ?
      <article className="events">
        <div className="filterBar">
          <img src={require("./event-images/calendar.png")} alt="" className="calendar" onClick={
            () => {
              setSortDate(!sortDate)
            }
          } />
          <img src={require("./event-images/favorite.png")} alt="" className="sortFavorited" onClick={
            () => {
              setSortFavorited(!sortFavorited)
            }
          } />
          <img src={require("./event-images/comment-box.png")} alt="" className="sortComments" onClick={
            () => {
              setSortComments(!sortComments)
            }
          } />
          {
            <fieldset>
              <label htmlFor="eventType">EVENT TYPE:</label>
              <select
                name="eventType"
                required
                onChange={(event) => {
                  const select = parseInt(event.target.value);
                  // console.log(select);
                  setDropDown(select);
                }}
              >
                <option id="procuctType--default" value={0}>
                  All Events
                </option>
                {eventTypes.map((eventType) => {
                  return (
                    <option key={eventType.id} value={eventType.id}>
                      {eventType.type}
                    </option>
                  );
                })}
              </select>
            </fieldset>
          }
          {cheekwoodUserObject.userType === "employee" ? (
            <>
              <div className="addEventContainer">
                <button className="addEvent" onClick={() => navigate("/add-event")}>ADD EVENT</button>
                <img src={require("./event-images/add.png")} alt="" />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="spacer"></div>
        {filteredEvents.map((event) => (
          <>
            <div className="eventSpacer">
              <Event
                key={`event--${event.id}`}
                id={event.id}
                name={event.name}
                summary={event.summary}
                startDate={event.startDate}
                endDate={event.endDate}
                eventType={event?.eventType?.type}
                image={event.linkImage}
                patronSavedEvent={event.patronSavedEvents}
                fetchEvents={fetchEvents}
                events2={events2}
                fetchEvents2={fetchEvents2}
              />
            </div>
          </>
        ))}
      </article> : <></>
    }</>;
};
 