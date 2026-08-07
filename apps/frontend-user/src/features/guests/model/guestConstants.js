export const DEFAULT_GROUPS = [
  { id: "groom-side", name: "Groom Side", note: "ខាងកូនកំលោះ" },
  { id: "bride-side", name: "Bride Side", note: "ខាងកូនក្រមុំ" },
];

export const DEFAULT_CATEGORIES = [
  { id: "high-school", name: "High School Friend", note: "មិត្តភក្តិវិទ្យាល័យ" },
  { id: "college", name: "College Friend", note: "មិត្តភក្តិសាកលវិទ្យាល័យ" },
  { id: "friend", name: "Friend", note: "មិត្តភក្តិ" },
  { id: "family", name: "Family", note: "គ្រួសារ" },
  { id: "coworker", name: "Coworker", note: "សហការី" },
  { id: "other", name: "Other", note: "ផ្សេងៗ" },
];

export const SEND_STATUS = {
  pending: "មិនទាន់ផ្ញើ",
  sent: "បានផ្ញើ",
  opened: "បានបើក",
  responded: "បានឆ្លើយតប",
};

export const EMPTY_GUEST_FORM = {
  name: "",
  companionName: "",
  phone: "",
  group: DEFAULT_GROUPS[0].name,
  category: DEFAULT_CATEGORIES[0].name,
  note: "",
  count: "1",
  seat: "",
  sendStatus: SEND_STATUS.pending,
};
