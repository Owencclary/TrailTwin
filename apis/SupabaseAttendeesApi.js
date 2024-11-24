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
  { event_id, user_id },
  handlers = {}
) => {
  const url = `https://ctiafgkrjympwdsviiew.supabase.co/rest/v1/attendees`;
  const options = {
    body: JSON.stringify({ event_id: event_id, user_id: user_id }),
    headers: cleanHeaders({
      Accept: 'application/json',
      Authorization: Constants['HEADER'],
      'Content-Type': 'application/json',
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
  event_id,
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
  } = useCreateAttendeePOST(
    { event_id, user_id },
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

export const getEventsByUserIdGET = async (
  Constants,
  { user_id },
  handlers = {}
) => {
  const paramsDict = {};
  if (user_id !== undefined) {
    paramsDict['user_id'] = `eq.${renderParam(user_id)}`;
  }
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

export const useGetEventsByUserIdGET = (
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
    () => getEventsByUserIdGET(Constants, args, handlers),
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

export const FetchGetEventsByUserIdGET = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  user_id,
}) => {
  const Constants = GlobalVariables.useValues();
  const isFocused = useIsFocused();
  const prevIsFocused = usePrevious(isFocused);

  const {
    isLoading: loading,
    data,
    error,
    refetch,
  } = useGetEventsByUserIdGET(
    { user_id },
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
  return children({ loading, data, error, refetchGetEventsByUserId: refetch });
};

export const getUsersByEventIDGET = async (
  Constants,
  { event_id, select },
  handlers = {}
) => {
  const paramsDict = {};
  if (select !== undefined) {
    paramsDict['select'] = renderParam(select);
  }
  if (event_id !== undefined) {
    paramsDict['event_id'] = `eq.${renderParam(event_id)}`;
  }
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

export const useGetUsersByEventIDGET = (
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
    () => getUsersByEventIDGET(Constants, args, handlers),
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

export const FetchGetUsersByEventIDGET = ({
  children,
  onData = () => {},
  handlers = {},
  refetchInterval,
  refetchOnWindowFocus,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  staleTime,
  event_id,
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
  } = useGetUsersByEventIDGET(
    { event_id, select },
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
  return children({ loading, data, error, refetchGetUsersByEventID: refetch });
};

export const removeAttendeeDELETE = async (
  Constants,
  { user_id },
  handlers = {}
) => {
  const paramsDict = {};
  if (user_id !== undefined) {
    paramsDict['user_id'] = `eq.${renderParam(user_id)}`;
  }
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
    method: 'DELETE',
  };
  const res = await fetch(url, options);
  return handleResponse(res, handlers);
};

export const useRemoveAttendeeDELETE = (
  initialArgs = {},
  { handlers = {} } = {}
) => {
  const queryClient = useQueryClient();
  const Constants = GlobalVariables.useValues();
  return useMutation(
    args =>
      removeAttendeeDELETE(Constants, { ...initialArgs, ...args }, handlers),
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
