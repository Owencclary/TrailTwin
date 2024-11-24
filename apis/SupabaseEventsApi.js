import * as React from 'react';
import {
  useQuery,
  useMutation,
  useIsFetching,
  useQueryClient,
} from 'react-query';
import useFetch from 'react-fetch-hook';
import { useIsFocused } from '@react-navigation/native';
import { handleResponse, isOkStatus } from '../utils/handleRestApiResponse';
import usePrevious from '../utils/usePrevious';
import {
  encodeQueryParam,
  renderParam,
  renderQueryString,
} from '../utils/encodeQueryParam';
import * as GlobalVariables from '../config/GlobalVariableContext';

const cleanHeaders = headers =>
  Object.fromEntries(Object.entries(headers).filter(kv => kv[1] != null));

export const createAttendeePOST = async (
  Constants,
  {
    attendeeAgeInputV1,
    attendeeSafetySelfie,
    eventIdInputV1,
    joinAttendeeNameInputV1,
  },
  handlers = {}
) => {
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/attendees`;
  const options = {
    body: JSON.stringify({
      attendee_name: joinAttendeeNameInputV1,
      attendee_age: attendeeAgeInputV1,
      attendee_safety_selfie: attendeeSafetySelfie,
      event_id: eventIdInputV1,
    }),
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      apiKey: Constants['apiKey'],
    }),
    method: 'POST',
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useCreateAttendeePOST = (
  initialArgs = {},
  { handlers = {} } = {}
) => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();
  return useMutation(
    args =>
      createAttendeePOST(Constants, { ...initialArgs, ...args }, handlers),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('attendees', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('attendee');
        queryClient.invalidateQueries('attendees');
      },
    }
  );
};

export const FetchCreateAttendeePOST = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  attendeeAgeInputV1,
  attendeeSafetySelfie,
  eventIdInputV1,
  joinAttendeeNameInputV1,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    isLoading: loading,
    data,
    error,
    mutate: refetch,
  } = useCreateAttendeePOST(
    {
      attendeeAgeInputV1,
      attendeeSafetySelfie,
      eventIdInputV1,
      joinAttendeeNameInputV1,
    },
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      handlers: { onData, ...handlers },
    }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  return children({ loading, data, error, refetchCreateAttendee: refetch });
};

export const createEventPOST = async (
  Constants,
  {
    dateInput,
    descriptionInput,
    eventPhoto,
    eventTypeInput,
    maxPartySizeInput,
    meetupLat,
    meetupLon,
    rideLength,
    rideNameInput,
    skillLevelInput,
    startTimeInput,
    tagsInput,
    trailNameInput,
    user_id,
  },
  handlers = {}
) => {
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events`;
  const options = {
    body: JSON.stringify({
      event_name: rideNameInput,
      trail_names: trailNameInput,
      event_description: descriptionInput,
      max_party_size: maxPartySizeInput,
      start_time: startTimeInput,
      date: dateInput,
      event_type: eventTypeInput,
      skill_level: skillLevelInput,
      tags: tagsInput,
      meetup_lat: meetupLat,
      meetup_lon: meetupLon,
      host_id: user_id,
      ride_length: rideLength,
      event_photo: eventPhoto,
    }),
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      apiKey: Constants['apiKey'],
    }),
    method: 'POST',
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useCreateEventPOST = (
  initialArgs = {},
  { handlers = {} } = {}
) => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();
  return useMutation(
    args => createEventPOST(Constants, { ...initialArgs, ...args }, handlers),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('events', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('event');
        queryClient.invalidateQueries('events');
      },
    }
  );
};

export const FetchCreateEventPOST = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  dateInput,
  descriptionInput,
  eventPhoto,
  eventTypeInput,
  maxPartySizeInput,
  meetupLat,
  meetupLon,
  rideLength,
  rideNameInput,
  skillLevelInput,
  startTimeInput,
  tagsInput,
  trailNameInput,
  user_id,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    isLoading: loading,
    data,
    error,
    mutate: refetch,
  } = useCreateEventPOST(
    {
      dateInput,
      descriptionInput,
      eventPhoto,
      eventTypeInput,
      maxPartySizeInput,
      meetupLat,
      meetupLon,
      rideLength,
      rideNameInput,
      skillLevelInput,
      startTimeInput,
      tagsInput,
      trailNameInput,
      user_id,
    },
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      handlers: { onData, ...handlers },
    }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  return children({ loading, data, error, refetchCreateEvent: refetch });
};

export const deleteEventDELETE = async (Constants, { id }, handlers = {}) => {
  const paramsDict = {};
  if (id !== undefined) {
    paramsDict['id'] = `eq.${renderParam(id)}`;
  }
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events${renderQueryString(
    paramsDict
  )}`;
  const options = {
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
    method: 'DELETE',
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useDeleteEventDELETE = (
  initialArgs = {},
  { handlers = {} } = {}
) => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();
  return useMutation(
    args => deleteEventDELETE(Constants, { ...initialArgs, ...args }, handlers),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('events', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('event');
        queryClient.invalidateQueries('events');
      },
    }
  );
};

export const getAttendeesByEventIdGET = async (
  Constants,
  { eventId, select },
  handlers = {}
) => {
  const paramsDict = {};
  paramsDict['select'] = select !== undefined ? renderParam(select) : '';
  paramsDict['event_id'] =
    eventId !== undefined ? `eq.${renderParam(eventId)}` : '';
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/attendees${renderQueryString(
    paramsDict
  )}`;
  const options = {
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useGetAttendeesByEventIdGET = (
  args = {},
  {
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    retry,
    staleTime,
    handlers = {},
  } = {}
) => {
  const Constants = GlobalVariables.useValues();
  return useQuery(
    ['attendees', args],
    () => getAttendeesByEventIdGET(Constants, args, handlers),
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
    }
  );
};

export const FetchGetAttendeesByEventIdGET = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  eventId,
  select,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetAttendeesByEventIdGET(
    { eventId, select },
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      handlers: { onData, ...handlers },
    }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  return children({
    loading,
    data,
    error,
    refetchGetAttendeesByEventId: refetch,
  });
};

export const getEventDetailGET = async (
  Constants,
  { detail, id },
  handlers = {}
) => {
  const paramsDict = {};
  if (detail !== undefined) {
    paramsDict['select'] = renderParam(detail);
  }
  paramsDict['id'] = id !== undefined ? `eq.${renderParam(id)}` : '';
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events${renderQueryString(
    paramsDict
  )}`;
  const options = {
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useGetEventDetailGET = (
  args = {},
  {
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    retry,
    staleTime,
    handlers = {},
  } = {}
) => {
  const Constants = GlobalVariables.useValues();
  const queryClient = useQueryClient();
  return useQuery(
    ['event', args],
    () => getEventDetailGET(Constants, args, handlers),
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      onSuccess: () => queryClient.invalidateQueries(['events']),
    }
  );
};

export const FetchGetEventDetailGET = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  detail,
  id,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetEventDetailGET(
    { detail, id },
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      handlers: { onData, ...handlers },
    }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  return children({ loading, data, error, refetchGetEventDetail: refetch });
};

export const getEventByHostIdGET = async (
  Constants,
  { host_id, select },
  handlers = {}
) => {
  const paramsDict = {};
  paramsDict['select'] = select !== undefined ? renderParam(select) : '';
  paramsDict['host_id'] =
    host_id !== undefined ? `eq.${renderParam(host_id)}` : '';
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events${renderQueryString(
    paramsDict
  )}`;
  const options = {
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useGetEventByHostIdGET = (
  args = {},
  {
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    retry,
    staleTime,
    handlers = {},
  } = {}
) => {
  const Constants = GlobalVariables.useValues();
  return useQuery(
    ['events', args],
    () => getEventByHostIdGET(Constants, args, handlers),
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
    }
  );
};

export const FetchGetEventByHostIdGET = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  host_id,
  select,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetEventByHostIdGET(
    { host_id, select },
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      handlers: { onData, ...handlers },
    }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  return children({ loading, data, error, refetchGetEventByHostId: refetch });
};

export const getEvents$DescendingOrder$GET = async (
  Constants,
  { select },
  handlers = {}
) => {
  const paramsDict = {};
  paramsDict['select'] = select !== undefined ? renderParam(select) : '';
  paramsDict['order'] = 'id.desc';
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events${renderQueryString(
    paramsDict
  )}`;
  const options = {
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useGetEvents$DescendingOrder$GET = (
  args = {},
  {
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    retry,
    staleTime,
    handlers = {},
  } = {}
) => {
  const Constants = GlobalVariables.useValues();
  return useQuery(
    ['events', args],
    () => getEvents$DescendingOrder$GET(Constants, args, handlers),
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
    }
  );
};

export const FetchGetEvents$DescendingOrder$GET = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  select,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetEvents$DescendingOrder$GET(
    { select },
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      handlers: { onData, ...handlers },
    }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  return children({
    loading,
    data,
    error,
    refetchGetEvents$DescendingOrder$: refetch,
  });
};

export const getSingleEventGET = async (
  Constants,
  { id, select },
  handlers = {}
) => {
  const paramsDict = {};
  paramsDict['select'] = select !== undefined ? renderParam(select) : '';
  paramsDict['id'] = id !== undefined ? `eq.${renderParam(id)}` : '';
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events${renderQueryString(
    paramsDict
  )}`;
  const options = {
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useGetSingleEventGET = (
  args = {},
  {
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    retry,
    staleTime,
    handlers = {},
  } = {}
) => {
  const Constants = GlobalVariables.useValues();
  const queryClient = useQueryClient();
  return useQuery(
    ['event', args],
    () => getSingleEventGET(Constants, args, handlers),
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      onSuccess: () => queryClient.invalidateQueries(['events']),
    }
  );
};

export const FetchGetSingleEventGET = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  id,
  select,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetSingleEventGET(
    { id, select },
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      handlers: { onData, ...handlers },
    }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  return children({ loading, data, error, refetchGetSingleEvent: refetch });
};

export const getMeetupLatGET = async (
  Constants,
  { id, meetupLat },
  handlers = {}
) => {
  const paramsDict = {};
  if (meetupLat !== undefined) {
    paramsDict['select'] = renderParam(meetupLat);
  }
  paramsDict['id'] = id !== undefined ? `eq.${renderParam(id)}` : '';
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events${renderQueryString(
    paramsDict
  )}`;
  const options = {
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useGetMeetupLatGET = (
  args = {},
  {
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    retry,
    staleTime,
    handlers = {},
  } = {}
) => {
  const Constants = GlobalVariables.useValues();
  const queryClient = useQueryClient();
  return useQuery(
    ['event', args],
    () => getMeetupLatGET(Constants, args, handlers),
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      onSuccess: () => queryClient.invalidateQueries(['events']),
    }
  );
};

export const FetchGetMeetupLatGET = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  id,
  meetupLat,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetMeetupLatGET(
    { id, meetupLat },
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      handlers: { onData, ...handlers },
    }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  return children({ loading, data, error, refetchGetMeetupLat: refetch });
};

export const getMeetupLonGET = async (
  Constants,
  { id, meetupLon },
  handlers = {}
) => {
  const paramsDict = {};
  if (meetupLon !== undefined) {
    paramsDict['select'] = renderParam(meetupLon);
  }
  paramsDict['id'] = id !== undefined ? `eq.${renderParam(id)}` : '';
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events${renderQueryString(
    paramsDict
  )}`;
  const options = {
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useGetMeetupLonGET = (
  args = {},
  {
    refetchInterval,
    refetchOnWindowFocus,
    refetchOnMount,
    refetchOnReconnect,
    retry,
    staleTime,
    handlers = {},
  } = {}
) => {
  const Constants = GlobalVariables.useValues();
  const queryClient = useQueryClient();
  return useQuery(
    ['event', args],
    () => getMeetupLonGET(Constants, args, handlers),
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      onSuccess: () => queryClient.invalidateQueries(['events']),
    }
  );
};

export const FetchGetMeetupLonGET = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  id,
  meetupLon,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetMeetupLonGET(
    { id, meetupLon },
    {
      refetchInterval,
      refetchOnWindowFocus,
      refetchOnMount,
      refetchOnReconnect,
      retry,
      staleTime,
      handlers: { onData, ...handlers },
    }
  );

  React.useEffect(() => {
    if (!prevIsFocused && isFocused) {
      refetch();
    }
  }, [isFocused, prevIsFocused]);

  React.useEffect(() => {
    if (error) {
      console.error('Fetch error: ' + error.status + ' ' + error.statusText);
      console.error(error);
    }
  }, [error]);
  return children({ loading, data, error, refetchGetMeetupLon: refetch });
};

export const updateAttendeesPUT = async (
  Constants,
  { attendeeIds, id, totalRiders },
  handlers = {}
) => {
  const paramsDict = {};
  if (id !== undefined) {
    paramsDict['id'] = `eq.${renderParam(id)}`;
  }
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events${renderQueryString(
    paramsDict
  )}`;
  const options = {
    body: JSON.stringify({
      id: id,
      attendee_ids: attendeeIds,
      total_riders: totalRiders,
    }),
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
    method: 'PUT',
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useUpdateAttendeesPUT = (
  initialArgs = {},
  { handlers = {} } = {}
) => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();
  return useMutation(
    args =>
      updateAttendeesPUT(Constants, { ...initialArgs, ...args }, handlers),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('events', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('event');
        queryClient.invalidateQueries('events');
      },
    }
  );
};

export const updateEventPATCH = async (
  Constants,
  {
    evenDesc,
    eventDate,
    eventLat,
    eventLon,
    eventName,
    eventPartySize,
    eventRideLength,
    eventSkill,
    eventTags,
    eventTime,
    eventTrails,
    eventType,
    id,
  },
  handlers = {}
) => {
  const paramsDict = {};
  if (id !== undefined) {
    paramsDict['id'] = `eq.${renderParam(id)}`;
  }
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events${renderQueryString(
    paramsDict
  )}`;
  const options = {
    body: JSON.stringify({
      event_name: eventName,
      start_time: eventTime,
      date: eventDate,
      tags: eventTags,
      event_description: evenDesc,
      trail_names: eventTrails,
      meetup_lat: eventLat,
      meetup_lon: eventLon,
      skill_level: eventSkill,
      event_type: eventType,
      max_party_size: eventPartySize,
      ride_length: eventRideLength,
    }),
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
    method: 'PATCH',
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useUpdateEventPATCH = (
  initialArgs = {},
  { handlers = {} } = {}
) => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();
  return useMutation(
    args => updateEventPATCH(Constants, { ...initialArgs, ...args }, handlers),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('events', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('event');
        queryClient.invalidateQueries('events');
      },
    }
  );
};

export const updateEventStatusPATCH = async (
  Constants,
  { event_status, id },
  handlers = {}
) => {
  const paramsDict = {};
  if (id !== undefined) {
    paramsDict['id'] = `eq.${renderParam(id)}`;
  }
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/events${renderQueryString(
    paramsDict
  )}`;
  const options = {
    body: JSON.stringify({ event_status: event_status }),
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
      apiKey: Constants['apiKey'],
    }),
    method: 'PATCH',
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useUpdateEventStatusPATCH = (
  initialArgs = {},
  { handlers = {} } = {}
) => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();
  return useMutation(
    args =>
      updateEventStatusPATCH(Constants, { ...initialArgs, ...args }, handlers),
    {
      onError: (err, variables, { previousValue }) => {
        if (previousValue) {
          return queryClient.setQueryData('events', previousValue);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries('event');
        queryClient.invalidateQueries('events');
      },
    }
  );
};
