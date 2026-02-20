from django.contrib import admin

# Register your models here.
from .models import RentRequest

admin.site.register(RentRequest)