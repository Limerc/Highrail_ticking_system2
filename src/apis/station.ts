import { req } from "./req";

export const getStationName = (s_id: string): Promise<string> =>
  req({ url: '/station/name', params: { s_id } })

export const getBeginTime = (t_id: number): Promise<string> =>
  req({ url: '/station/beginTime', params: { t_id } })

export const getArrivalTime = (t_id: number): Promise<string> =>
  req({ url: '/station/arrivalTime', params: { t_id } })
