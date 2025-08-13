import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { fetchBrands } from '../services/api';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScale = useRef(new Animated.Value(0.8)).current;
  const cardAnimations = useRef([]).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Initialize card animations
  const initializeCardAnimations = (count) => {
    cardAnimations.splice(0);
    for (let i = 0; i < count; i++) {
      cardAnimations.push({
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(30),
      });
    }
  };

  // Floating animation for background elements
  const startFloatingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Shimmer animation for loading
  const startShimmerAnimation = () => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  };

  // Ranking algorithm with weights
  const calculateRank = (brand) => {
    let rank = 0;

    if (brand.foundedYear) {
      const yearsEstablished = new Date().getFullYear() - parseInt(brand.foundedYear);
      rank += yearsEstablished * 2;
    }

    if (brand.description && brand.description.length > 50) rank += 10;
    if (brand.logoUrl) rank += 5;
    if (brand.website) rank += 5;
    if (brand.headquarters) rank += 3;
    if (brand.founderName) rank += 3;

    if (brand.socialMedia) {
      if (brand.socialMedia.facebook) rank += 2;
      if (brand.socialMedia.instagram) rank += 3;
      if (brand.socialMedia.twitter) rank += 2;
      if (brand.socialMedia.linkedin) rank += 1;
    }

    return Math.max(0, rank);
  };

  // Animate cards in sequence
  const animateCardsIn = (count) => {
    const animations = cardAnimations.slice(0, count).map((anim, index) => {
      return Animated.parallel([
        Animated.timing(anim.scale, {
          toValue: 1,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(50, animations).start();
  };

  // Main entrance animation
  const startEntranceAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    startFloatingAnimation();
    startShimmerAnimation();
    
    const loadBrands = async () => {
      try {
        const brandsData = await fetchBrands();
        let brandsList = [];

        if (brandsData) {
          Object.keys(brandsData).forEach((key) => {
            const brand = brandsData[key];
            const calculatedRank = calculateRank(brand);
            brandsList.push({
              id: key,
              ...brand,
              calculatedRank,
            });
          });

          brandsList.sort((a, b) => b.calculatedRank - a.calculatedRank);
          brandsList = brandsList.map((brand, index) => ({
            ...brand,
            positionRank: index + 1,
          }));

          const topBrands = brandsList.slice(0, 10);
          setBrands(topBrands);
          
          // Initialize animations for loaded brands
          initializeCardAnimations(topBrands.length);
          
          setTimeout(() => {
            animateCardsIn(topBrands.length);
          }, 300);
        }
        setLoading(false);
        startEntranceAnimation();
      } catch (err) {
        console.error('Error loading brands:', err);
        setError('Failed to load brands. Please try again.');
        setLoading(false);
        startEntranceAnimation();
      }
    };

    loadBrands();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    headerScale.setValue(0.8);
    
    try {
      const brandsData = await fetchBrands();
      let brandsList = [];

      if (brandsData) {
        Object.keys(brandsData).forEach((key) => {
          const brand = brandsData[key];
          const calculatedRank = calculateRank(brand);
          brandsList.push({
            id: key,
            ...brand,
            calculatedRank,
          });
        });

        brandsList.sort((a, b) => b.calculatedRank - a.calculatedRank);
        brandsList = brandsList.map((brand, index) => ({
          ...brand,
          positionRank: index + 1,
        }));

        const topBrands = brandsList.slice(0, 10);
        setBrands(topBrands);
        
        initializeCardAnimations(topBrands.length);
        setTimeout(() => {
          animateCardsIn(topBrands.length);
        }, 300);
      }
      setLoading(false);
      startEntranceAnimation();
    } catch (err) {
      setError('Failed to refresh brands. Please try again.');
      setLoading(false);
      startEntranceAnimation();
    }
  };

  const renderFloatingElements = () => {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.floatingElement,
              {
                top: `${10 + (index * 15)}%`,
                left: `${5 + (index * 12)}%`,
                transform: [
                  {
                    translateY: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, index % 2 === 0 ? -20 : 20],
                    }),
                  },
                  {
                    rotate: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', `${index * 30}deg`],
                    }),
                  },
                ],
                opacity: 0.1,
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
              style={styles.floatingGradient}
            />
          </Animated.View>
        ))}
      </View>
    );
  };

  const renderShimmerCard = () => {
    const shimmerTranslate = shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [-width, width],
    });

    return (
      <View style={styles.shimmerCard}>
        <View style={styles.shimmerRank} />
        <View style={styles.shimmerLogo} />
        <View style={styles.shimmerContent}>
          <View style={styles.shimmerTitle} />
          <View style={styles.shimmerSubtitle} />
        </View>
        <Animated.View
          style={[
            styles.shimmerOverlay,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient 
        colors={['#1a1a2e', '#16213e', '#0f3460']} 
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        {renderFloatingElements()}
        
        <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
          <View style={styles.loadingContent}>
            <LinearGradient
              colors={['#ff6b6b', '#4ecdc4', '#45b7d1']}
              style={styles.loadingGradientCircle}
            >
              <ActivityIndicator size="large" color="#fff" />
            </LinearGradient>
            <Text style={styles.loadingText}>Discovering Amazing Brands...</Text>
            
            {/* Shimmer loading cards */}
            <View style={styles.shimmerContainer}>
              {[...Array(3)].map((_, index) => (
                <View key={index} style={{ marginTop: 15 }}>
                  {renderShimmerCard()}
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient 
        colors={['#1a1a2e', '#16213e', '#0f3460']} 
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        {renderFloatingElements()}
        
        <Animated.View 
          style={[
            styles.loadingContainer, 
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255,107,107,0.1)', 'rgba(255,107,107,0.05)']}
            style={styles.errorContainer}
          >
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
              <LinearGradient
                colors={['#ff6b6b', '#ff5252']}
                style={styles.retryButtonGradient}
              >
                <Text style={styles.retryButtonText}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </LinearGradient>
    );
  }

  const renderBrandCard = ({ item, index }) => {
    const cardAnim = cardAnimations[index] || {
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      translateY: new Animated.Value(0),
    };

    const getRankGradient = (rank) => {
      if (rank === 1) return ['#ffd700', '#ffed4e', '#ff9500'];
      if (rank === 2) return ['#c0c0c0', '#e5e5e5', '#a8a8a8'];
      if (rank === 3) return ['#cd7f32', '#daa520', '#b8860b'];
      return ['#667eea', '#764ba2', '#5a67d8'];
    };

    return (
      <Animated.View
        style={[
          {
            opacity: cardAnim.opacity,
            transform: [
              { scale: cardAnim.scale },
              { translateY: cardAnim.translateY },
            ],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.brandCardContainer}
          onPress={() => navigation.navigate('BrandDetail', { brand: item })}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.brandCard}
          >
            <BlurView intensity={20} style={styles.cardBlur}>
              <LinearGradient
                colors={getRankGradient(item.positionRank)}
                style={styles.rankBadge}
              >
                <Text style={styles.rankText}>{item.positionRank}</Text>
                {item.positionRank <= 3 && (
                  <Text style={styles.crownEmoji}>
                    {item.positionRank === 1 ? '👑' : item.positionRank === 2 ? '🥈' : '🥉'}
                  </Text>
                )}
              </LinearGradient>
              
              <View style={styles.logoContainer}>
                <Image 
                  source={{ 
                    uri: item.logoUrl || 'https://cdn.iconscout.com/icon/free/png-256/free-image-upload-3638245-3032363.png' 
                  }} 
                  style={styles.logo} 
                  onError={(e) => {
                    e.nativeEvent.source = { 
                      uri: 'https://cdn.iconscout.com/icon/free/png-256/free-image-upload-3638245-3032363.png' 
                    };
                  }}
                />
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'transparent']}
                  style={styles.logoGlow}
                />
              </View>
              
              <View style={styles.brandInfo}>
                <Text style={styles.brandName}>{item.name}</Text>
                <Text style={styles.brandTagline}>
                  {item.description ? item.description.substring(0, 50) + '...' : 'Discover more'}
                </Text>
                {/* <View style={styles.scoreContainer}>
                  <Text style={styles.scoreLabel}>Score:</Text>
                  <Text style={styles.scoreValue}>{item.calculatedRank}</Text>
                </View> */}
              </View>
              
              <View style={styles.cardGlow} />
            </BlurView>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient 
      colors={['#1a1a2e', '#16213e', '#0f3460']} 
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      {renderFloatingElements()}
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.headerContainer,
            {
              transform: [{ scale: headerScale }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.headerBackground}
          >
            <Text style={styles.header}>✨ Elite Brands Today</Text>
            <Text style={styles.subHeader}>Discover the most exceptional brands</Text>
          </LinearGradient>
        </Animated.View>
        
        {brands.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No brands discovered yet</Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
              <LinearGradient
                colors={['#4ecdc4', '#44a08d']}
                style={styles.retryButtonGradient}
              >
                <Text style={styles.retryButtonText}>Explore Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={brands}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderBrandCard}
            refreshing={loading}
            onRefresh={handleRefresh}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  floatingElement: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  floatingGradient: {
    flex: 1,
    borderRadius: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContent: {
    alignItems: 'center',
    width: '100%',
  },
  loadingGradientCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  shimmerContainer: {
    width: '100%',
  },
  shimmerCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 15,
  },
  shimmerLogo: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 15,
  },
  shimmerContent: {
    flex: 1,
  },
  shimmerTitle: {
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    marginBottom: 8,
    width: '70%',
  },
  shimmerSubtitle: {
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 7,
    width: '50%',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: 100,
  },
  headerContainer: {
    marginBottom: 30,
  },
  headerBackground: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontWeight: '300',
  },
  brandCardContainer: {
    marginBottom: 20,
  },
  brandCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  cardBlur: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  rankBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  crownEmoji: {
    position: 'absolute',
    top: -5,
    right: -5,
    fontSize: 12,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 15,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logoGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  brandTagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginRight: 5,
  },
  scoreValue: {
    color: '#4ecdc4',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  listContainer: {
    paddingBottom: 20,
  },
  errorContainer: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.3)',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;