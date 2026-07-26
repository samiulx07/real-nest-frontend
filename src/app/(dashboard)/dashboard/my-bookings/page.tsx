import MyBookingsMainView from "@/mainViews/dashboard/myBookingsMainView/MyBookingsMainView";

export const metadata = {
  title: "My Bookings - Real Nest",
  description: "View customer flat bookings and property reservations",
};

export default function MyBookingsPage() {
  return <MyBookingsMainView />;
}
