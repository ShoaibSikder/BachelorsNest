from rest_framework import serializers
from .models import Property, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ('id', 'image')


class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ('owner', 'is_approved', 'created_at')


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
            owner=self.context['request'].user, **validated_data
        )
        for img in images_data:
            PropertyImage.objects.create(property=property_instance, image=img)
        return property_instance

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        for img in images_data:
            PropertyImage.objects.create(property=instance, image=img)
        return instance