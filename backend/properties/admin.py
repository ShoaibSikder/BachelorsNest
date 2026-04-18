from django.contrib import admin
from .models import Property, PropertyImage, Wishlist

# Register your models here.
admin.site.register(Property)
admin.site.register(PropertyImage)
admin.site.register(Wishlist)
