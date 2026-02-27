import { env } from "../config/env.js";

const safeFetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`Provider request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const buildFallbackFlights = ({ from, to, date, note }) => {
  const baseDate = new Date(`${date}T06:00:00`);
  const makeIso = (hourOffset) => new Date(baseDate.getTime() + hourOffset * 60 * 60 * 1000).toISOString();

  return {
    provider: "fallback",
    note,
    results: [
      {
        airline: "IndiGo",
        flightNumber: "6E-521",
        departureAirport: from.toUpperCase(),
        arrivalAirport: to.toUpperCase(),
        departureTime: makeIso(0),
        arrivalTime: makeIso(2),
        status: "scheduled",
      },
      {
        airline: "Air India",
        flightNumber: "AI-676",
        departureAirport: from.toUpperCase(),
        arrivalAirport: to.toUpperCase(),
        departureTime: makeIso(3),
        arrivalTime: makeIso(5),
        status: "scheduled",
      },
      {
        airline: "Akasa Air",
        flightNumber: "QP-1497",
        departureAirport: from.toUpperCase(),
        arrivalAirport: to.toUpperCase(),
        departureTime: makeIso(6),
        arrivalTime: makeIso(8),
        status: "scheduled",
      },
    ],
  };
};

export const searchFlights = async ({ from, to, date }) => {
  if (!env.AVIATIONSTACK_API_KEY) {
    return buildFallbackFlights({
      from,
      to,
      date,
      note: "Set AVIATIONSTACK_API_KEY in backend/.env for live provider data.",
    });
  }

  const url = new URL("https://api.aviationstack.com/v1/flights");
  url.searchParams.set("access_key", env.AVIATIONSTACK_API_KEY);
  url.searchParams.set("dep_iata", from.toUpperCase());
  url.searchParams.set("arr_iata", to.toUpperCase());
  url.searchParams.set("flight_date", date);
  url.searchParams.set("limit", "20");

  try {
    const data = await safeFetchJson(url.toString());
    const results = (data.data || []).map((item) => ({
      airline: item.airline?.name || "Unknown airline",
      flightNumber: item.flight?.iata || item.flight?.number || "N/A",
      departureAirport: item.departure?.airport || item.departure?.iata || from.toUpperCase(),
      arrivalAirport: item.arrival?.airport || item.arrival?.iata || to.toUpperCase(),
      departureTime: item.departure?.scheduled || item.departure?.estimated || null,
      arrivalTime: item.arrival?.scheduled || item.arrival?.estimated || null,
      status: item.flight_status || "scheduled",
    }));

    if (results.length === 0) {
      return buildFallbackFlights({
        from,
        to,
        date,
        note: "Provider returned no flights for this route/date. Showing fallback results.",
      });
    }

    return { provider: "aviationstack", results };
  } catch (error) {
    return buildFallbackFlights({
      from,
      to,
      date,
      note: `Live provider failed (${error.message}). Showing fallback results.`,
    });
  }
};

export const searchTrains = async ({ from, to, date, time }) => {
  const url = new URL("https://transport.opendata.ch/v1/connections");
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);
  url.searchParams.set("date", date);
  if (time) {
    url.searchParams.set("time", time);
  }
  url.searchParams.set("limit", "10");

  const data = await safeFetchJson(url.toString());
  const results = (data.connections || []).map((item) => ({
    from: item.from?.station?.name || from,
    to: item.to?.station?.name || to,
    departure: item.from?.departure || null,
    arrival: item.to?.arrival || null,
    duration: item.duration || "N/A",
    transfers: item.transfers ?? 0,
    service: item.products?.join(", ") || "Train",
  }));

  return { provider: "transport-opendata-ch", results };
};
