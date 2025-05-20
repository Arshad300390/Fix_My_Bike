/* eslint-disable react-hooks/exhaustive-deps */
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../../constants/Constants';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

const ReviewScreen = ({ navigation, route }) => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState('');
    const [ratingError, setRatingError] = useState('');
    const isFormValid = reviewText.trim() !== '' && rating.trim() !== '';
    const { shopOwnerId, productSummary = [] } = route.params;
    const [selectedProduct, setSelectedProduct] = useState(productSummary[0] || null);
    useEffect(() => {
        console.log(productSummary, 'productSummary');
    }, []);


    const handleSubmitReview = async () => {
        const numericRating = Number(rating);

        // Clear previous error
        setRatingError('');

        if (!rating || !reviewText) {
            if (!rating) setRatingError('Rating is required');
            return;
        }

        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            setRatingError('Rating must be a number between 1 and 5');
            return;
        }

        const itemId = selectedProduct.product_id;
        const itemType = 'Product';
        console.log(itemId, 'itemId');

        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.replace('Signin');
                return;
            }

            const response = await fetch(`http://10.0.2.2:5000/api/reviews/create-review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    itemId,
                    itemType,
                    rating: Number(rating),
                    comment: reviewText,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Review submitted!');
                setReviewText('');
                setRating('');
                navigation.navigate('Home');
            } else {
                alert(data.error || 'Something went wrong.');
            }
        } catch (err) {
            console.error(err);
            alert('Error submitting review');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.mainContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Write a Review for product</Text>

                {/* <Pressable style={styles.input} onPress={() => setShowModal(true)}>
                    <Text>{selectedProduct?.product_name || 'Select a Product'}</Text>
                </Pressable> */}
                <Text style={styles.label}>Select a Product</Text>
<View style={styles.pickerWrapper}>
    <Picker
        selectedValue={selectedProduct?.product_id}
        onValueChange={(itemValue, itemIndex) => {
            const product = productSummary.find(p => p.product_id === itemValue);
            setSelectedProduct(product);
        }}
        mode="dropdown" // or "dialog" on Android
    >
        <Picker.Item label="Select a product..." value={null} />
        {productSummary.map((product) => (
            <Picker.Item
                key={product.product_id}
                label={product.product_name}
                value={product.product_id}
            />
        ))}
    </Picker>
</View>





                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Write your experience here..."
                    value={reviewText}
                    onChangeText={setReviewText}
                    multiline
                />

                <TextInput
                    style={styles.input}
                    placeholder="Rating (1 to 5)"
                    value={rating}
                    onChangeText={(val) => {
                        setRating(val);
                        setRatingError(''); // Clear error as user types
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                />

                {ratingError ? (
                    <Text style={styles.errorText}>{ratingError}</Text>
                ) : null}


                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        !isFormValid && styles.disabledButton,
                    ]}
                    onPress={handleSubmitReview}
                    disabled={!isFormValid}
                >
                    <Text style={[
                        styles.submitButtonText,
                        !isFormValid && styles.disabledButtonText,
                    ]}>
                        Submit Review
                    </Text>
                </TouchableOpacity>


            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ReviewScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    scrollContent: {
        padding: 20,
        justifyContent: 'center',
        gap: 20,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.black,
        backgroundColor: COLORS.lightGray,
    },
    textArea: {
        height: height * 0.18,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    errorText: {
        color: 'red',
        fontSize: 13,
        marginTop: 4,
        marginLeft: 4,
    },
    disabledButton: {
        backgroundColor: COLORS.gray,
    },
    disabledButtonText: {
        color: COLORS.lightGray,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 6,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        backgroundColor: COLORS.lightGray,
    },
    

});
