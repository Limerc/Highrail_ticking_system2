import { useUserStore } from "@/stores/user"
import { ContentType, req } from "./req"

export interface Duration {
  type: string;
  value: string;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  wholeSeconds: number;
  microSeconds: number;
  seconds: number;
  null: boolean;
}

export interface QueryTicketReq {
  begin_station_name: string
  arrive_station_name: string
  start_date: string | Date
}

export type QueryTicketResp = {
  duration: Duration;
  h_id: number;
  h_name: string;
  begin_time: string;
  left_tickets: number;
  begin_station: string;
  begin_tid: number;
  arrive_station: string;
  arrive_tid: number;
  arrive_time: string;
}[]

export const queryTicket = (params: QueryTicketReq): Promise<QueryTicketResp> =>
  req({ url: '/ticketshop', params })


export interface BuyTicketReq {
  h_id: number
  begin_station: string
  arrive_station: string
  begin_station_interval: number
  arrive_station_interval: number
  duration: string
}

export const buyTicket = (data: BuyTicketReq): Promise<void> =>
  req({ url: '/ticketshop', data, method: 'POST', contentType: ContentType.JSON })

export type TicketHistoryResp = {
  beginTid: number;
  arriveTid: number;
  beginStation: string;
  arriveStation: string;
  orderTime: string;
  ticketChange: boolean;
  isRefund: boolean;
  fee: number;
  uid: number;
  oid: number;
  hid: number;
}[]

export const getTicketHistory = (u_id: number): Promise<TicketHistoryResp> =>
  req({ url: '/ticket', params: { u_id } })


export interface TicketChangeReq {
  o_id: number;
  h_id: number;
  begin_tid: number;
  arrive_tid: number;
  duration: string;
}


export const putTicketChange = (data: TicketChangeReq): Promise<number> =>
  req({ url: '/ticket', data, method: 'PUT', contentType: ContentType.JSON })

export const delTicketChange = (o_id: number): Promise<number> =>
  req({ url: '/ticket', data: { o_id }, method: 'DELETE', contentType: ContentType.JSON })

