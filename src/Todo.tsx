import { useEffect, useState } from 'react';
import { NavLink as RouterNavLink, RouteComponentProps } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { findIana } from "windows-iana";
import { Event } from 'microsoft-graph';
import { getTodoList } from './GraphService';
import { useAppContext } from './AppContext';
import { AuthenticatedTemplate } from '@azure/msal-react';
import { add, format, getDay, parseISO } from 'date-fns';
import { endOfWeek, startOfWeek } from 'date-fns/esm';

export default function Todo(props: RouteComponentProps) {
  const app = useAppContext();

  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    const loadEvents = async() => {
      if (app.user && !events) {
        try {
          const ianaTimeZones = findIana(app.user?.timeZone!);
          const events = await getTodoList(app.authProvider!, ianaTimeZones[0].valueOf());
          setEvents(events);
        } catch (err) {
          app.displayError!(err.message);
        }
      }
    };

    loadEvents();
  });

  return (
    <AuthenticatedTemplate>
      <pre><code>{JSON.stringify(events, null, 2)}</code></pre>
    </AuthenticatedTemplate>
  );
}