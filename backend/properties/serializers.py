from rest_framework import serializers
from .models import Property, PropertyImage


# 🔹 Property Image Serializer
class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image')


# 🔹 Property Serializer (READ)
class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ('owner', 'is_approved', 'created_at')

    def get_owner(self, obj):
        return {
            "id": obj.owner.id,
            "username": obj.owner.username,
            "profile_image": obj.owner.profile_image.url if hasattr(obj.owner, "profile_image") and obj.owner.profile_image else None
        }


# 🔹 Property Create/Update Serializer (WRITE)
class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Property
        fields = ('title', 'location', 'rent', 'property_type', 'description', 'images')

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

        # Remove specified images
        if remove_images:
            PropertyImage.objects.filter(id__in=remove_images).delete()

        # Handle images: if 'images' field is present in request, replace all existing images
        if 'images' in self.context['request'].data:
            # Delete all existing images first
            instance.images.all().delete()
            # Add new images if any
            for img in images_data:
                PropertyImage.objects.create(property=instance, image=img)

        return instance