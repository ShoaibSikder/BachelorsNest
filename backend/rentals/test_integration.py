from asgiref.sync import async_to_sync
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework.test import APITransactionTestCase

from backend.asgi import application


@override_settings(CHANNEL_LAYERS={
    "default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}
})
class RentalJourneyTests(APITransactionTestCase):
    password = "SamplePass20!"

    def sign_in(self, username):
        self.client.credentials()
        response = self.client.post("/api/token/", {
            "username_or_email": username, "password": self.password,
        }, format="json")
        self.assertEqual(response.status_code, 200)
        refresh = self.client.post("/api/token/refresh/", {"refresh": response.data["refresh"]})
        self.assertEqual(refresh.status_code, 200)
        access = refresh.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        self.assertEqual(self.client.get("/api/accounts/profile/").status_code, 200)
        return access

    def test_listing_to_conversation(self):
        for name in ("owner", "bachelor"):
            response = self.client.post("/api/accounts/register/", {
                "username": name, "role": name, "email": f"{name}@example.test",
                "password": self.password,
            }, format="json")
            self.assertEqual(response.status_code, 201)
        users = get_user_model().objects
        users.create_user(username="moderator", email="moderator@example.test",
                          password=self.password, role="admin")
        self.sign_in("owner")
        created = self.client.post("/api/properties/add/", {
            "title": "Sample flat", "location": "Dhaka", "property_type": "flat",
            "description": "One-bedroom flat", "rent": "10000.00", "is_available": "true",
        }, format="multipart")
        self.assertEqual(created.status_code, 201)
        listing = self.client.get("/api/properties/owner/").data[0]["id"]
        self.sign_in("moderator")
        self.assertEqual(self.client.patch(f"/api/properties/approve/{listing}/").status_code, 200)
        self.assertEqual(self.client.get("/api/accounts/admin-dashboard/").status_code, 200)
        self.assertEqual(self.client.get("/api/notifications/admin/logs/").status_code, 200)
        self.sign_in("bachelor")
        self.assertEqual(self.client.get("/api/properties/approved/").data["results"][0]["id"], listing)
        self.assertEqual(self.client.post(f"/api/properties/{listing}/wishlist/").status_code, 201)
        request = self.client.post("/api/rentals/request/", {"property": listing})
        self.assertEqual(request.status_code, 201, request.data)
        self.sign_in("owner")
        self.assertEqual(self.client.patch(f"/api/rentals/update/{request.data['id']}/",
                                          {"status": "accepted"}).status_code, 200)
        access = self.sign_in("bachelor")
        notification = self.client.get("/api/notifications/").data[0]
        marked = self.client.patch(f"/api/notifications/read/{notification['id']}/")
        self.assertTrue(marked.data["is_read"])
        contact = self.client.get("/api/messages/users/").data[0]["id"]
        async_to_sync(self.exchange_message)(contact, access)
        conversation = self.client.get(f"/api/messages/conversation/{contact}/")
        self.assertEqual(conversation.data[0]["content"], "Is the flat furnished?")

    async def exchange_message(self, contact, access):
        socket = WebsocketCommunicator(application, f"/ws/chat/{contact}/?token={access}")
        connected, _ = await socket.connect(timeout=5)
        self.assertTrue(connected)
        try:
            self.assertEqual((await socket.receive_json_from())["type"], "status")
            await socket.send_json_to({"message": "Is the flat furnished?"})
            self.assertEqual((await socket.receive_json_from(timeout=5))["content"],
                             "Is the flat furnished?")
        finally:
            await socket.disconnect()
