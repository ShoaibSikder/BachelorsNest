from rest_framework import serializers

from .models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image')


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    owner = serializers.SerializerMethodField()
    vacancy_count = serializers.IntegerField(read_only=True)
    saved_count = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = (
            'owner',
            'is_approved',
            'is_rejected',
            'created_at',
            'vacancy_count',
            'saved_count',
            'is_saved',
        )

    def get_owner(self, obj):
        return {
            "id": obj.owner.id,
            "username": obj.owner.username,
            "email": obj.owner.email,
            "profile_image": (
                obj.owner.profile_image.url
                if hasattr(obj.owner, "profile_image") and obj.owner.profile_image
                else None
            ),
        }

    def get_saved_count(self, obj):
        return obj.wishlists.count()

    def get_is_saved(self, obj):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated or getattr(user, 'role', None) != 'bachelor':
            return False
        return obj.wishlists.filter(bachelor=user).exists()


class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Property
        fields = (
            'title',
            'location',
            'rent',
            'property_type',
            'description',
            'available_from',
            'is_available',
            'total_seats',
            'occupied_seats',
            'images',
        )

    def validate(self, attrs):
        instance = getattr(self, 'instance', None)
        property_type = attrs.get(
            'property_type',
            getattr(instance, 'property_type', None)
        )
        total_seats = attrs.get('total_seats', getattr(instance, 'total_seats', 1))
        occupied_seats = attrs.get(
            'occupied_seats',
            getattr(instance, 'occupied_seats', 0)
        )

        if property_type == 'flat':
            attrs['total_seats'] = 1
            attrs['occupied_seats'] = 1 if occupied_seats else 0
            return attrs

        if total_seats < 1:
            raise serializers.ValidationError(
                {"total_seats": "Total seats must be at least 1."}
            )

        if occupied_seats > total_seats:
            raise serializers.ValidationError(
                {"occupied_seats": "Occupied seats cannot exceed total seats."}
            )

        return attrs

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        property_instance = Property.objects.create(
            owner=self.context['request'].user,
            **validated_data
        )

        for img in images_data:
            PropertyImage.objects.create(property=property_instance, image=img)

        return property_instance

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        remove_images = self.context['request'].data.getlist('remove_images', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if remove_images:
            PropertyImage.objects.filter(id__in=remove_images).delete()

        if 'images' in self.context['request'].data:
            instance.images.all().delete()
            for img in images_data:
                PropertyImage.objects.create(property=instance, image=img)

        return instance
