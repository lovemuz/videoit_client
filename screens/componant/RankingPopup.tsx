import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { vw, vh } from 'react-native-css-vh-vw';
import FastImage from 'react-native-fast-image';
import { PALETTE } from '../../lib/constant/palette';

interface UserProfile {
    profile?: string;
    nick?: string;
    id?: string | number;
    country?: string;
    age?: number;
}

interface RankingPopupProps {
    visible: boolean;
    onClose: () => void;
    userProfile?: UserProfile | null;
    country?: string;
}

const RankingPopup: React.FC<RankingPopupProps> = ({
    visible,
    onClose,
    userProfile,
    country = "ko"
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                    }}
                    onPress={onClose}
                    activeOpacity={1}
                />

                <View style={{
                    backgroundColor: 'white',
                    width: vw(85),
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 25,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}>
                    {/* 헤더 */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        marginBottom: 20,
                        paddingBottom: 15,
                        borderBottomWidth: 1,
                        borderBottomColor: '#EFEFEF',
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: PALETTE.COLOR_RED,
                        }}>
                            {country === "ko"
                                ? `차단하기`
                                : country === "ja"
                                    ? `ブロック`
                                    : country === "es"
                                        ? `Bloquear`
                                        : country === "fr"
                                            ? `Bloquer`
                                            : country === "id"
                                                ? `Blokir`
                                                : country === "zh"
                                                    ? `屏蔽`
                                                    : `Block`}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Image
                                source={require("../../assets/rank/close.png")}
                                style={{
                                    width: 24,
                                    height: 24,
                                }}></Image>
                        </TouchableOpacity>
                    </View>

                    {/* 별점 */}
                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: 20,
                    }}>
                        <Image
                            source={require("../../assets/rank/star.png")}
                            style={{
                                width: 24,
                                height: 24,
                                marginBottom: 3,
                            }}></Image>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#F7A409',
                        }}>4.0</Text>
                    </View>

                    {/* 프로필 이미지 */}
                    <FastImage
                        source={{
                            uri: userProfile?.profile || "",
                            priority: FastImage.priority.normal,
                        }}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            marginBottom: 15,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />

                    {/* 사용자 이름 */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 25,
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#333',
                            marginRight: 8,
                        }}>
                            {userProfile?.nick || "카리나"}
                        </Text>
                        <View style={{
                            backgroundColor: '#4CAF50',
                            borderRadius: 10,
                            width: 20,
                            height: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>✓</Text>
                        </View>
                    </View>

                    {/* 후원 순위 섹션 */}
                    <View style={{
                        width: '100%',
                        borderWidth: 2,
                        borderColor: '#4A90E2',
                        borderRadius: 12,
                        padding: 15,
                        marginBottom: 20,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#333',
                            textAlign: 'center',
                            marginBottom: 15,
                        }}>
                            {country === "ko" ? "후원 순위" : "Sponsor Ranking"}
                        </Text>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}>
                            {/* 1등 */}
                            <View style={{ alignItems: 'center' }}>
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: '#FFD700',
                                    backgroundColor: '#F5F5F5',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                }}>
                                    <Text style={{ fontSize: 16 }}>👤</Text>
                                </View>
                                <Text style={{ fontSize: 10, color: '#FFD700' }}>🏆</Text>
                                <Text style={{ fontSize: 10, color: '#333' }}>유저닉네임</Text>
                            </View>

                            {/* 2등 */}
                            <View style={{ alignItems: 'center' }}>
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: '#C0C0C0',
                                    backgroundColor: '#F5F5F5',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                }}>
                                    <Text style={{ fontSize: 16 }}>👤</Text>
                                </View>
                                <Text style={{ fontSize: 10, color: '#C0C0C0' }}>🏆</Text>
                                <Text style={{ fontSize: 10, color: '#333' }}>유저닉네임</Text>
                            </View>

                            {/* 3등 */}
                            <View style={{ alignItems: 'center' }}>
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    borderWidth: 2,
                                    borderColor: '#CD7F32',
                                    backgroundColor: '#F5F5F5',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 5,
                                }}>
                                    <Text style={{ fontSize: 16 }}>👤</Text>
                                </View>
                                <Text style={{ fontSize: 10, color: '#CD7F32' }}>🏆</Text>
                                <Text style={{ fontSize: 10, color: '#333' }}>유저닉네임</Text>
                            </View>
                        </View>
                    </View>

                    {/* 통화 평균시간 */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        marginBottom: 20,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            color: '#333',
                        }}>
                            {country === "ko" ? "통화 평균시간" : "Average Call Time"}
                        </Text>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#4A90E2',
                        }}>149.7초</Text>
                    </View>

                    {/* 통계 그리드 */}
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginBottom: 25,
                    }}>
                        <View style={{
                            width: '48%',
                            backgroundColor: '#F8F8F8',
                            borderRadius: 8,
                            padding: 15,
                            alignItems: 'center',
                            marginBottom: 10,
                        }}>
                            <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>15초 미만</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>438</Text>
                        </View>

                        <View style={{
                            width: '48%',
                            backgroundColor: '#F8F8F8',
                            borderRadius: 8,
                            padding: 15,
                            alignItems: 'center',
                            marginBottom: 10,
                        }}>
                            <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>1분 미만</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>620</Text>
                        </View>

                        <View style={{
                            width: '48%',
                            backgroundColor: '#F8F8F8',
                            borderRadius: 8,
                            padding: 15,
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>3분 미만</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>485</Text>
                        </View>

                        <View style={{
                            width: '48%',
                            backgroundColor: '#F8F8F8',
                            borderRadius: 8,
                            padding: 15,
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>3분 이상</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>434</Text>
                        </View>
                    </View>

                    {/* 하단 버튼들 */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        width: '100%',
                    }}>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            flex: 1,
                            marginHorizontal: 5,
                        }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#8B4513',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 5,
                            }}>
                                <Text style={{ fontSize: 20 }}>📹</Text>
                            </View>
                            <Text style={{ fontSize: 12, color: '#333' }}>
                                {country === "ko" ? "영상통화" : "Video Call"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            alignItems: 'center',
                            flex: 1,
                            marginHorizontal: 5,
                        }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#8B4513',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 5,
                            }}>
                                <Text style={{ fontSize: 20 }}>💬</Text>
                            </View>
                            <Text style={{ fontSize: 12, color: '#333' }}>
                                {country === "ko" ? "채팅" : "Chat"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            alignItems: 'center',
                            flex: 1,
                            marginHorizontal: 5,
                        }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: '#8B4513',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 5,
                            }}>
                                <Text style={{ fontSize: 20 }}>👤</Text>
                            </View>
                            <Text style={{ fontSize: 12, color: '#333' }}>
                                {country === "ko" ? "프로필" : "Profile"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default RankingPopup;