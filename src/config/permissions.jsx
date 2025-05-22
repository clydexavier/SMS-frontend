export const PERMISSIONS = {
    admin: {
      events: { read: true, write: true, delete: true },
      teams: { read: true, write: true, delete: true },
      players: { read: true, write: true, delete: true, approve: true },
      gallery: { read: true, write: true, delete: true },
      podiums: { read: true, write: false, delete: false },
      bracket: { read: true, write: true, delete: true },
      games: { read: true, write: true, delete: true },
      results: { read: true, write: true, delete: true },
      tally: { read: true, write: false, delete: false }
    },
    GAM: {
      events: { read: true, write: false, delete: false },
      teams: { read: true, write: false, delete: false },
      players: { read: true, write: false, delete: false, approve: false },
      gallery: { read: true, write: false, delete: false },
      podiums: { read: true, write: false, delete: false },
      bracket: { read: true, write: false, delete: false },
      games: { read: true, write: false, delete: false },
      results: { read: true, write: false, delete: false },
      tally: { read: true, write: false, delete: false }
    }
  };