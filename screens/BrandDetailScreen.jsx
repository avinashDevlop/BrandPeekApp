import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Linking,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';

const BrandDetailScreen = ({ route }) => {
  const { brand } = route.params;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleWebsitePress = () => {
    if (brand.website) {
      Linking.openURL(brand.website.startsWith('http') ? brand.website : `https://${brand.website}`);
    }
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#334155']}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#1e40af', '#1e3a8a']}
            style={styles.logoContainer}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
            <Image 
              source={{ uri: brand.logoUrl || 'https://cdn.iconscout.com/icon/free/png-512/free-company-1779860-1513787.png' }} 
              style={styles.brandLogo}
              onError={(e) => {
                e.nativeEvent.source = { uri: 'https://cdn.iconscout.com/icon/free/png-512/free-company-1779860-1513787.png' };
              }}
            />
          </LinearGradient>
          
          <LinearGradient
            colors={['#2563eb', '#1d4ed8']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.brandNameContainer}
          >
            <Text style={styles.brandName}>{brand.name}</Text>
          </LinearGradient>
          
          {brand.positionRank && (
            <View style={styles.rankContainer}>
              <LinearGradient
                colors={['#1e3a8a', '#172554']}
                style={styles.rankBadge}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <MaterialIcons name="leaderboard" size={18} color="#93c5fd" />
                <Text style={styles.rankText}>Rank: #{brand.positionRank}</Text>
              </LinearGradient>
              {/* <LinearGradient
                colors={['#1e293b', '#0f172a']}
                style={styles.scoreBadge}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <FontAwesome name="star" size={16} color="#fbbf24" />
                <Text style={styles.scoreText}>Score: {brand.calculatedRank}</Text>
              </LinearGradient> */}
            </View>
          )}

          {brand.tagline && (
            <LinearGradient
              colors={['#1e40af', '#1e3a8a']}
              style={styles.taglineContainer}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <Text style={styles.brandTagline}>"{brand.tagline}"</Text>
            </LinearGradient>
          )}

          <LinearGradient
            colors={['transparent', '#64748b', 'transparent']}
            style={styles.divider}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          />

          <LinearGradient
            colors={['#1e293b', '#0f172a']}
            style={styles.descriptionContainer}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          >
            {brand.description ? (
              <Text style={styles.brandDescription}>{brand.description}</Text>
            ) : (
              <Text style={styles.noDescription}>No description available</Text>
            )}
          </LinearGradient>

          <LinearGradient
            colors={['#1e293b', '#0f172a']}
            style={styles.detailsContainer}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          >
            {brand.foundedYear && (
              <View style={styles.detailRow}>
                <Feather name="calendar" size={18} color="#60a5fa" style={styles.detailIcon} />
                <Text style={styles.detailText}>Founded in {brand.foundedYear}</Text>
              </View>
            )}
            {brand.headquarters && (
              <View style={styles.detailRow}>
                <Feather name="map-pin" size={18} color="#60a5fa" style={styles.detailIcon} />
                <Text style={styles.detailText}>{brand.headquarters}</Text>
              </View>
            )}
            {brand.founderName && (
              <View style={styles.detailRow}>
                <Feather name="user" size={18} color="#60a5fa" style={styles.detailIcon} />
                <Text style={styles.detailText}>Founded by {brand.founderName}</Text>
              </View>
            )}
            {brand.website && (
              <TouchableOpacity 
                style={styles.detailRow} 
                onPress={handleWebsitePress}
                activeOpacity={0.7}
              >
                <Feather name="globe" size={18} color="#93c5fd" style={styles.detailIcon} />
                <Text style={[styles.detailText, styles.linkText]}>Visit website</Text>
              </TouchableOpacity>
            )}
          </LinearGradient>

          <TouchableOpacity 
            style={styles.followButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2563eb', '#1d4ed8']}
              style={styles.buttonGradient}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <Text style={styles.followButtonText}>Follow Brand</Text>
              <MaterialIcons name="add" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  brandLogo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: 'rgba(30, 64, 175, 0.5)',
  },
  brandNameContainer: {
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: 'white',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  rankContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
  },
  rankText: {
    fontSize: 14,
    color: '#93c5fd',
    marginLeft: 5,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 14,
    color: '#fbbf24',
    marginLeft: 5,
    fontWeight: '600',
  },
  taglineContainer: {
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  brandTagline: {
    fontSize: 16,
    color: '#bfdbfe',
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    marginVertical: 15,
    width: '80%',
    alignSelf: 'center',
  },
  descriptionContainer: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  brandDescription: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    color: '#e2e8f0',
    fontWeight: '400',
  },
  noDescription: {
    fontSize: 16,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  detailsContainer: {
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  linkText: {
    color: '#93c5fd',
    fontWeight: '600',
  },
  followButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default BrandDetailScreen;